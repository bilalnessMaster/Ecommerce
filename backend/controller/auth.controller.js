import User from "../models/User.js"
import jwt from 'jsonwebtoken'
import {redis} from "../lib/redis.js"

const generateToken = (userId) => {
    console.log(userId);
    
   try{
    const accessToken = jwt.sign({userId},process.env.ACCESS_TOKEN_SECRET,{
        expiresIn :"15m"
    })
    const refreshToken = jwt.sign({userId},process.env.REFRESH_TOKEN_SECRET,{
        expiresIn :"7d"
    })
    return {accessToken , refreshToken}
   }catch(error){
        console.log("error in token: "+ error);
        
   }
}

const storeRefreshoken = async (userId, refreshToken)=>{
    try{
        await redis.set(`refresh_token:${userId}`,refreshToken,"EX" ,7*24*60*60) // mean expire in 7 days
       }catch(error){
            console.log("error in redis: "+ error);
            
       }
}

const setCookie = (res ,accessToken ,  refreshToken )=>{
    try{
        res.cookie("accessToken", accessToken , {
            httpOnly : true,
            secure : process.env.NODE_ENV == 'production',
            sameSite : "strict" , 
            maxAge : 15*60*1000
        })
        res.cookie("refreshToken", refreshToken , {
            httpOnly : true,
            secure : process.env.NODE_ENV == 'production',
            sameSite : "strict" , 
            maxAge : 7*24*60*60*1000
        })
       }catch(error){
            console.log("error in cookie: "+ error);
            
       }
}




export const signup = async (req , res)=>{
    const {name ,  email , password} = req.body
    try{
    
    
    const userExist = await User.findOne({email})
    if(userExist) return res.status(400).json({message :" User already exists"})
    const user = await User.create({name ,email , password})   
    const {accessToken , refreshToken } = generateToken(user._id)   
    await storeRefreshoken(user._id, refreshToken)
    setCookie(res ,accessToken ,  refreshToken  )
    return res.status(201).json({user:{
        _id : user._id,
        name : user.name,
        email : user.email,
        role : user.role
    },message:" User created successfully"})
}catch (error){
        console.log("this is : "+error);
        
    }
}







export const login = async (req , res)=>{
    
    
    try{
        const {email , password} = req.body  

        const user  = await User.findOne({email})
        if(!user) return res.status(404).json({message : "User not found"})
        const isMatch = await user.comparePassword(password)
        console.log(isMatch);
        
        if(isMatch){
            const {accessToken , refreshToken} = generateToken(user._id)
            await storeRefreshoken(user._id, refreshToken)
            setCookie(res , accessToken , refreshToken)
        }
        return res.status(200).json({message : "login successfully" , user : { 
            _id : user._id, 
            name : user.name,
            email : user.email, 
            role : user.role,
            cartitems : user.cartitems
         }})

    }catch(error){
        console.log("this is happened in login controller : "+error);
        res.status(500).json({message : "server error" , error : error.message})
    }

}
export const logout = async (req , res)=>{
    try{
        const refreshToken = req.cookies.refreshToken
        if(refreshToken){
            const check = jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET)
            await redis.del(`refresh_token:${check.userId}`)
        }

        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")
        return res.status(200).json({message : "logout successfully"})
    }catch(error){
        res.status(500).json({message : "server error" , error : error.message})    
        console.log('error occured in Logout'+ error);
        
    }

}
export const getProfile = async (req , res)=> { 
    try  {
       res.json(req.user)
    }catch(error){
        res.status(500).json({message : "server error" , error : error.message})
        console.log( "error occured in getProfile"+ error);
        
    }
}
export const refreshOldToken = async (req , res)=>{
   try { 
    const refreshToken = req.cookies.refreshToken

    if(!refreshToken) return res.status(401).json({message : "Please login"})
    const check = jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET)
    const isExist = await redis.get(`refresh_token:${check.userId}`)

    if (isExist !== refreshToken) return res.status(401).json({message : "Please login"})
    const accessToken = jwt.sign({userId : check.userId} , process.env.ACCESS_TOKEN_SECRET)
   res.cookie("accessToken", accessToken , {
    httpOnly : true,
    secure : process.env.NODE_ENV == 'production',
    sameSite : "strict" , 
    maxAge : 15*60*1000
   })     
    return res.status(200).json({message : "refresh token successfully"})
   }catch(error){
    console.log("error occured in refreshOldToken"+ error); 
    res.status(500).json({message : "server error" , error : error.message})    
   }
}