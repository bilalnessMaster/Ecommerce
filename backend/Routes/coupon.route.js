import express from 'express'
 const router = express.Router();
import {  getCoupon , isValidation} from "../controller/coupon.controller.js"
import { protectRoute } from '../middleware/auth.middleware.js';
router.get("/", protectRoute , getCoupon ) 
router.post("/validation", protectRoute , isValidation) 
export default router