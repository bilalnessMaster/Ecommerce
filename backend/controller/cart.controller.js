import Product from "../models/Product.js"
export const addtoCart = async (req , res) => {
        try {
            const {productId} = req.body 
           
            
            const user = req.user
      
            
            const existingItem = user.cartitems.find(item => item.id === productId)
            if(existingItem){
                existingItem.quantity += 1
            }else { 
                user.cartitems.push(productId)
            }
            await user.save();
            res.json(user.cartitems);
        }catch(error ){
            console.log("error occured in addtoCart"+ error);
            res.status(500).json({message : "server error" , error : error.message})
        }
}


export const removeAllfromCart = async (req , res)=>{
        const {id} = req.params

        
        const user  = req.user
        
        try{
            const existingItem = user.cartitems.find(item => item.id === id)
            if(existingItem){
                user.cartitems = user.cartitems.filter(item => item.id !== id)
                await user.save()
                res.json(user.cartItems)
            }else { 
                res.status(404).json({message : "product not found"})
            }
        }catch(error){
            console.log("error occured in removeAllfromCart"+ error);
            res.status(500).json({message : "server error" , error : error.message})
        }
}

export const updateQuantity = async (req , res) => {
    try { 
        const {id : productId} = req.params
        const user = req.user
        const {quantity} = req.body
        const existingItem = user.cartitems.find(item => item.id === productId)

        if(existingItem){
            if(quantity === 0 ){
                user.cartItems = user.cartitems.filter(item => item.id !== productId)
                await user.save()
                return res.json(user.cartItems)
                }
        existingItem.quantity = quantity
        await user.save()
        res.json(user.cartItems)
        }else { 
            res.status(404).json({message : "product not found"})
        }

    

}catch(error){

}
}
export const getCarteProducts = async (req , res) => {
    try { 
        const products = await Product.find({_id:{$in : req.user.cartitems}})
        const cartItems = products.map(item => {
            const cartItem = req.user.cartitems.find(cartItem  => cartItem.id === item.id)
            return {...item.toJSON(),quantity : cartItem.quantity}
        })
        res.json(cartItems);
    }catch(error){
        console.log("error occured in getCarteProducts"+ error);    
        res.status(500).json({message : "server error" , error : error.message})
    }
}