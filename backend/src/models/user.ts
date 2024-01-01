import mongoose from "mongoose"
import bcrypt from "bcryptjs"

export type userType = {
    _id :string;
    email:string;
    password:string;
    firstName:string;
    lastName:string;
}

const UserSchema = new mongoose.Schema({
    email:{type:String , required:true,unique:true},
    password:{type:String, required:true},
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
})
// befor saving the data encrypt the password here first
// its work as middle ware handled by mongodb
UserSchema.pre("save",async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,8)
    }
    next();
})
const User = mongoose.model<userType>("User",UserSchema);
export default User;