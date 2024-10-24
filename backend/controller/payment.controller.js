import Coupon from "../models/Coupon.js"
import {stripe} from "../lib/stripe.js"
import Order from "../models/Order.js"
import dotenv from "dotenv"
dotenv.config()
export const createCheckoutSession = async (req , res) => {
    try { 
        const {products  , couponCode }= req.body
        if(!Array.isArray(products) || products.length === 0 ){
            return res.status(400).json({message : "products are required"})
        } 
        let totalAmount = 0 ; 
        const lineItems = products.map(product => { 
            const amount = Math.round(product.price * 100)
            totalAmount += amount*product.quantity
            return { 
                price_data :  {
                    currency  : "usd" , 
                    product_data : {
                        name : product.name,
                        images  : [product.image]
                    },
                    unit_amount : amount
                }
                ,quantity : product.quantity || 1 ,
            }
        });
        let coupon = null
        if(couponCode){
            coupon = await Coupon.findOne({code : couponCode,userId : req.user._id , isActive : true})   
            if(coupon){
                totalAmount -= Math.round(totalAmount * coupon.discountPercentage / 100)
            }
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types : ['card',],
            line_items : lineItems, 
            mode : 'payment', 
            success_url : `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
            discounts : coupon ? [{
                coupon  : await createSripeCoupon(coupon.discountPercentage)
            }]: [],
            metadata : {
                userId : req.user._id.toString(),
                couponCode :couponCode || "", 
                products : JSON.stringify(products.map(item => { 
                    return {id : item._id , 
                        quantity : item.quantity , 
                        price : item.price,
                        name : item.name
                    }
                }))
            }
           
        })  
        if(totalAmount >= 200*100){
            const newCoupon = await createCoupon(req.user._id)
        }
        res.status(200).json({id : session.id , totalAmount : totalAmount/100}) 

    }catch(error){ 
        console.log("error occured in createCheckoutSession"+ error);
        res.status(500).json({message : "server error" , error : error.message})
        
    }
}
async function createSripeCoupon(discountPercentage){
    const coupon = await stripe.coupons.create({
        percent_off : discountPercentage,
        duration : "once", 
    })
    return coupon.id
}
async function createCoupon(userId ){
    await Coupon.findOneAndDelete({userId : userId})
    const newCoupon = new Coupon({
        code : "GIFT"+Math.random().toString(36).substring(2,8).toUpperCase(),
        discountPercentage : 10, 
        expirationDate : new Date(Date.now()+ 30*24*60*60*1000),
        userId  : userId 

    })
    await newCoupon.save()
    return newCoupon
}


export const CheckoutSuccess = async (req , res)=> {
    try{    
        const {sessionId } = req.body

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if(session.payment_status === "paid"){
            if(session.metadata.couponCode){
                const coupon  = await Coupon.findOneAndUpdate({
                    code  : session.metadata.couponCode,
                    userId  : session.metadata.userId
                },{
                    isActive : false
                })
            }

            const products = JSON.parse(session.metadata.products)
            const order  = new Order({
                    user: session.metadata.userId,
                    products : products.map(item => ({
                        product  : item.id , 
                        quantity : item.quantity,
                        price : item.price , 

                    })) , 
                    totalAmount : session.amount_total/100, 
                    paymentIntent : session.payment_intent,
                    stripeSessionId :sessionId,
                   
                    


            })
            await order.save()
            req.user.cartitems = []
            await req.user.save()
            
            res.status(200).json({message : "order created successfully" , succes : true , orderid : order._id})

        }


    }catch(error){
        console.log("error occured in CheckoutSuccess"+ error);
        res.status(500).json({message : "server error" , error : error.message})
    }
}