import express from 'express'
import dotenv  from 'dotenv'
import authrouter from "./Routes/auth.route.js"
import productrouter from "./Routes/product.route.js"
import cartrouter from "./Routes/cart.route.js"
import couponrouter from "./Routes/coupon.route.js"
import paymentrouter from "./Routes/payment.route.js"
import analyticsrouter from "./Routes/analytics.route.js"
import {connectDB} from './lib/db.js'
import cookieParser from 'cookie-parser'
dotenv.config()
const app = express()
app.use(express.json())
app.use(cookieParser())
const Port  = process.env.PORT || 5000
const __dirname = path.resolve()

app.use("/api/auth" , authrouter)
app.use("/api/products" , productrouter)
app.use("/api/cart" , cartrouter)
app.use("/api/coupons" , couponrouter)
app.use("/api/payments" , paymentrouter)
app.use("/api/analytics" , analyticsrouter)


if (process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}
app.listen(Port , ()=>{
    connectDB()
    console.log("app running at http://localhost:"+Port);
    console.log(process.env.CLIENT_URL);
    
    
})