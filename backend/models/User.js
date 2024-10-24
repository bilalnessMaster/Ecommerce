import mongoose from "mongoose";
import bcrypt from "bcryptjs"
const Schema = mongoose.Schema
const UserSchema = new Schema({
    name : {
        type : String , 
        required : [true , "Name is required"],
        min : 3,
        max : 20, 
    },
    email : {
        required : [true , "Email is required"] , 
        unique : true  , 
        type: String,
        trim : true , 
        lowercase : true
    },
    password : {
        type :String , 
        required : [true , "password is required"],
        minlength : [6 , 'password must be at least 6 charcaters long']
    },
    cartitems : [
        {
            quantity: {
                type: Number,
                default: 1,
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        },
    ],
    role : {
        type : String , 
        enum : ["customer", "admin"],
        default : "customer"
    }
},{ timestamps:true})

UserSchema.pre("save" , async function(next){
    if (!this.isModified("password")) return next()
    try { 
        const salt = await bcrypt.genSalt(16)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    }catch(error) {
        next(error)
        console.log("error related to password hashing"+ error);
        
    }
    
    
})
UserSchema.methods.comparePassword = async function(password){
    return bcrypt.compare(password ,this.password )
}
const User = mongoose.model('User',UserSchema)

export default User 
