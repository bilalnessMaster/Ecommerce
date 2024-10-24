import express from 'express'
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js'
import { getAnalyticsData , getdailySalesData} from '../controller/analytics.controller.js'
const router = express.Router()


router.get("/" ,protectRoute ,adminRoute ,async (req , res)=>{
    try{
        const analytics = await getAnalyticsData()
        const endDate = new Date() ;
        const startDate = new Date(endDate.getTime() - 30*24*60*60*1000) ; 
        const dailySalesData = await  getdailySalesData( startDate ,endDate )
        res.status(200).json({analytics , dailySalesData})
   
    }catch(error){
        console.log("error occured in route getAnalyticsData"+ error);    
        res.status(500).json({message : "server error" , error : error.message})
    }
})











export default router