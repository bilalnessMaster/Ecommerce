import User from "../models/User.js"
import jwt from 'jsonwebtoken'
export const protectRoute  = async (req , res , next) =>{
    try {
        const accessToken = req.cookies.accessToken 
        if(!accessToken) return res.status(401).json({message : "Unauthorized - No access token provided"});   
        try
        {
            const check = jwt.verify(accessToken , process.env.ACCESS_TOKEN_SECRET)
            const user  = await User.findById(check.userId).select("-password")
            if (!user) return res.status(401).json({message : "User not found"})
                
            req.user = user
            next()
        }catch(error){
            return res.status(404).json({message : error.message})
            
    }

    } catch (error) {
        res.status(500).json({message : "server error" , error : error.message})
    }

}
export const adminRoute = async (req , res , next) =>{
        if (req.user && req.user.role === "admin"){
            next()
        }else { 
            return res.status(403).json({message :  "access denied"})
        }


}