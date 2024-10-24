import express from 'express'
const router = express.Router();
import {addtoCart, removeAllfromCart ,updateQuantity ,getCarteProducts}  from "../controller/cart.controller.js"
import { protectRoute } from '../middleware/auth.middleware.js';

router.post('/',protectRoute, addtoCart)
router.get('/',protectRoute, getCarteProducts)
router.delete('/:id',protectRoute, removeAllfromCart)
router.put('/:id',protectRoute, updateQuantity)


export default router