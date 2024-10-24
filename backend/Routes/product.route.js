import express from 'express'
const router  = express.Router();
import {getAllProduct ,getAllFeatured,toggelFeaturesProductRoute ,createRoute ,deleteRoute, getrecommendation ,getcaterogyRoute} from "../controller/product.controller.js"
import {protectRoute ,adminRoute ,} from '../middleware/auth.middleware.js'  


router.get('/' ,protectRoute , adminRoute, getAllProduct)
router.get('/Featured' ,getAllFeatured)
router.get('/category/:category',getcaterogyRoute)
router.get('/recommendations' ,getrecommendation)
router.post('/', protectRoute , adminRoute, createRoute)
router.delete('/:id', protectRoute , adminRoute, deleteRoute)
router.patch('/:id', protectRoute , adminRoute, toggelFeaturesProductRoute)

export default router