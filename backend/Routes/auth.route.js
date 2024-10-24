import express from 'express'
const router = express.Router()
import {signup,login, logout ,refreshOldToken ,getProfile} from "../controller/auth.controller.js"
import {protectRoute} from '../middleware/auth.middleware.js'
router.post('/signup' , signup)
router.post('/login',login)
router.post('/logout' , logout)
router.post('/refreshOldToken', refreshOldToken)
router.get('/profile', protectRoute , getProfile)

 

export default router