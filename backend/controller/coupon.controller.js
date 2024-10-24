import Coupon from "../models/Coupon.js"
export const getCoupon = async (req , res) => {
        try { 
            const coupon  = await Coupon.findOne({userId : req.user , isActive : true})
            res.json({coupon : coupon})
        }catch(error) { 
            res.status(500).json({message : "server error" , error : error.message})    
            console.log("error occured in getCoupon"+ error);
            
        }

}


export const  isValidation = async (req, res) =>  { 
        try { 
            const {code} =req.body
            const coupon = await Coupon.findOne({code :code , isActive : true , userId : req.user._id})
            if(!coupon) return res.status(404).json({message : "coupon not found"})
            if(coupon.expirationDate < Date.now()) {
                coupon.isActive = false
                await coupon.save()
                return res.status(404).json({message : "coupon expired"})
            }
            return res.json({
                message : "Coupon is valid",
                code : coupon.code,
                discountPercentage : coupon.discountPercentage
            })

        }catch(error)  { 
            res.status(500).json({message : "server error" , error : error.message})    
            console.log("error occured in isValidation"+ error);
        }
}