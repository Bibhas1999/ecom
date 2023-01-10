import mongoose from "mongoose";
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    mobile: { type: Number,min:[10,"Mobile muat be at least 10 characters long"], max:32 },
    password: { type: String, required: true, trim: true, min:[6,"Password muat be at least 6 characters long"], max:32},
    otp: { type: String, required: true},
    active: { type: Boolean, default: true },
    verified: { type: Boolean, default: false },
    reset_verified: {type: Boolean, default:true},
    token:{type:String},
    roles:{type:String,enum : ['Admin','User'],default:'User'}
  },
  { timestamps: true }
);

const userModel = mongoose.model("users", userSchema);

export default userModel;
