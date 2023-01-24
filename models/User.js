import mongoose from "mongoose";
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    profile_pic:{name:{type:String},file:{type:Buffer},mimeType:{type:String}},
    email: { type: String, required: true, trim: true },
    mobile: { type: Number},
    // address:{city:{type:String},state:{type:String},zip_code:{type:Number},landmark:{type:String}},
    address:{type:String},
    password: { type: String, required: true, trim: true, min:[6,"Password muat be at least 6 characters long"], max:32},
    otp: { type: String, required: true},
    active: { type: Boolean, default: true },
    verified: { type: Boolean, default: false },
    reset_verified: {type: Boolean, default:true},
    tokens_blacklisted:{type:Array},
    roles:{type:String,enum : ['Admin','User'],default:'User'}
  },
  { timestamps: true }
);

const User = mongoose.model("users", userSchema);

export default User;
