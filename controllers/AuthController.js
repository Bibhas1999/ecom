import User from "../models/User.js";
import bcrypt from "bcrypt";
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import HTTPError from "../ErrorHandlers/HTTPExceptions.js";
import ValidationError from "../ErrorHandlers/ValidationExceptions.js";
import { sendForgotPasswordEmail, sendVerificationEmail } from "../third_party_services/EmailService.js";
import { generateOtp } from "./middlewares/auth_middleware.js";
dotenv.config()
class AuthController {
    
  static login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const token = req.cookies.jwtoken
      if(token) throw new HTTPError("Another account is logged in.Please logout to continue",400)
      if(!email) throw new ValidationError('Email is required')
      if(!password) throw new ValidationError('Password is required')

        const user = await User.findOne({ email: email });
      
        if (user && (await bcrypt.compare(password, user.password))) {
            
          if(!user.verified) throw new HTTPError('Your account is not verified.Please verify your account to login',401) 
            const id = user._id
            const token = jwt.sign({id},process.env.JWT_SECRET_KEY)
            var oneWeek = 7 * 24 * 3600 * 1000
             res.cookie("jwtoken",token,{
              expires: new Date(Date.now() + oneWeek),
              httpOnly:true,
              sameSite:'none',
              secure:true
             })
            return res.status(200).json({
              msg:'Login Successful',
              user:{
                _id: user._id,
                name: user.name,
                email: user.email,  
              },
              status: 200,
              type:'success'
          });
        }else{
          throw new HTTPError("Email or Password doesn't match our records",404)
        }
      
    } catch (error) {
      console.log(error)
      if(error instanceof ValidationError) return res.status(error.statusCode).json({user:{},msg:error.messege,status:error.statusCode,type:'error'})
      if(error instanceof HTTPError) return res.status(error.statusCode).json({user:{},msg:error.messege,status:error.statusCode,type:'error'})
      return res.status(500).json({user:{},msg:"Something went wrong while logging in!",status:500,type:'error'}) 
    }
  };

  static register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const token = req.cookies.jwtoken
        if(token) throw new HTTPError("Another account is logged in.Please logout to continue",400)
        const result = await User.findOne({ email: email });
        if (!result) {
          let otp = generateOtp()
          let hashedPassword = bcrypt.hashSync(password, 10);
          let hashedOTP = bcrypt.hashSync(String(otp), 10);
          const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
            otp:hashedOTP
          });
          sendVerificationEmail(email,otp)
          await user.save();
        //   const id = user._id
        //   const token = jwt.sign({id},process.env.JWT_SECRET_KEY,{
        //     expiresIn:'2h'
        //  })
        //  var oneWeek = 7 * 24 * 3600 * 1000
        //  res.cookie("jwtoken",token,{
        //   expires: new Date(Date.now() + oneWeek),
        //   httpOnly:true,
        //   sameSite:'none',
        //   secure:true
        //  })       
          return res.status(200).json({ msg: "Registration Successfull. An OTP has been sent to your email address for verification.",user:{
            _id: user._id,
            name: user.name,
            email: user.email,  
          }, status:200, type:"success"})
        }else{
          throw new HTTPError('Email already registered',400)
        }
      } catch (error) {
        console.log(error);
        if(error instanceof ValidationError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        if(error instanceof HTTPError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        return res.status(500).json({msg:"Something went wrong while signing up!",status:500,type:'error'}) 
      }
  };

  static logout = async (req,res)=>{

      const token = req.cookies.jwtoken;
      if(token){
        res.clearCookie('jwtoken')
        return res.status(200).json({msg:"You have been logged out",type:"success",status:200})
      }
      return res.status(400).json({msg:"You haven't loggedin yet",type:"error",status:400})
  }

 static verifyAccount = async (req,res)=>{

  try {
    const {email,otp} = req.body
    if(!email) throw new ValidationError("Email is required")
    if(!otp) throw new ValidationError("OTP is required")
    let user = await User.findOne({email:email})

    if(!user)throw new HTTPError("User account doesn't exists",404)
    if(user.verified)throw new HTTPError("Account already verified",400)
    if(await bcrypt.compare(String(otp),user.otp)){
      await User.updateOne({email:email},{otp:"",verified:true})
      return res.status(200).json({msg:"Account verified successfully", status:200, type:'success'})
    }else{
      throw new HTTPError("OTP is invalid",400)
    }
  } catch (error) {
    console.log(error);
        if(error instanceof ValidationError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        if(error instanceof HTTPError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        return res.status(500).json({msg:"Something went wrong while verifying account!",status:500,type:'error'}) 
  }
 }

 static verifyResetOtp = async (req,res)=>{

  try {
    const {email,otp} = req.body
    if(!email) throw new ValidationError("Email is required")
    if(!otp) throw new ValidationError("OTP is required")
    let user = await User.findOne({email:email})
    if(!user)throw new HTTPError("User account doesn't exists",404)
    if(user.reset_verified)throw new HTTPError("Account already verified for resetting password you can now reset password",400)
    // if(await bcrypt.compare(String(otp),user.otp)){
     if(otp == user.otp){
      await User.updateOne({email:email},{otp:"",reset_verified:true})
      return res.status(200).json({msg:"Account verified successfully for resetting password", status:200, type:'success'})
    }else{
      throw new HTTPError("OTP is invalid",400)
    }
  } catch (error) {
    console.log(error);
        if(error instanceof ValidationError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        if(error instanceof HTTPError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        return res.status(500).json({msg:"Something went wrong while verifying account!",status:500,type:'error'}) 
  }
 }

 static resendOTP = async (req,res)=>{
  try {
    const {email , type} = req.body
    if(!email) throw new ValidationError("Email is required")
    if(!type) throw new ValidationError("Type must be specified")
    // if(type !=="va" || type !=="rp") throw new ValidationError("Invalid type!.Type must be either 'va' for verifying account or 'rp' for reset password")
    if(typeof type !=="string") throw new ValidationError("Type must be a string")
    let user = await User.findOne({email:email})
    if(!user) throw new HTTPError("User doesn't exists",404)
    let otp = generateOtp();
    if(type == "va"){
      if(user.verified) throw new ValidationError("Account already verified")
         await sendVerificationEmail(email,otp)
        let hashedOTP = bcrypt.hashSync(String(otp), 10);
        let updated = await User.updateOne({email:email},{otp:hashedOTP})
      if(!updated) throw("Something went wrong")
      return res.status(200).json({msg:'OTP Resent for verifying account',status:200,type:"success"})
      }else if(type == "rp"){
        if(user.reset_verified) throw new ValidationError("Account already verified")
         await sendForgotPasswordEmail(email,otp)
        let hashedOTP = bcrypt.hashSync(String(otp), 10);
        let updated = await User.updateOne({email:email},{otp:hashedOTP})
      if(!updated) throw("Something went wrong")
     return res.status(200).json({msg:'OTP Resent for reset password',status:200,type:"success"})
      }
  } catch (error) {
    console.log(error);
    if(error instanceof ValidationError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
    if(error instanceof HTTPError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
    return res.status(500).json({msg:"Something went wrong while verifying account!",status:500,type:'error'}) 
  }
    const {email , type} = req.body
    if(!email) return res.status(400).json({msg:"Email id is required to send otp",status:400,type:"error"})
    let user = await User.findOne({email:email})
    if(!user) return res.status(404).json({msg:"User Not Found", status:404, type:"error"})
    if(user.verified)return res.status(400).json({msg:"Your account is already verified",status:400,type:"error"})
    let otp = generateOtp();
    let hashedOTP = bcrypt.hashSync(String(otp), 10);
    let updated = await User.updateOne({email:email},{otp:hashedOTP})
    if(updated){
      try {
        sendVerificationEmail(email,otp)
      } catch (error) {
        return res.status(500).json({msg:"Something went wrong while sending email. Please try again",status:500,type:"error"})
      }
    
    res.status(200).json({msg:'OTP Resent',status:200,type:"success"})
    }else {res.status(500).json({msg:"Something Went Wrong",status:500,type:"error"})}
 }

 static forgotPassword = async (req,res) =>{
    const {email} = req.body
    if(!email) return res.status(400).json({msg:'Email id is required', status:400,type:"error"})
    let user = await User.findOne({email:email})
    if(!user) return res.status(404).json({msg:'User Not Found!', status:404,type:"error"})
    let otp = generateOtp();
    let hashedOTP = bcrypt.hashSync(String(otp), 10);
    let updated = await User.updateOne({email:email},{otp:otp,reset_verified:false})
    if(updated){
     try {
      await sendForgotPasswordEmail(email,otp)
     } catch (error) {
      return res.status(500).json({msg:"Something went wrong while sending email. Try resending request to get an OTP",status:500,type:"error"})
     } 
    
    res.status(200).json({msg:'An OTP has been sent to your email address.',status:200,type:"success"})
    }else {res.status(500).json({msg:"Something Went Wrong while sending sending forgot password mail.",status:500,type:"error"})}
 }

 static resetPasswordVerify = async (req,res) =>{

  try {
    const {email, new_password, retyped} = req.body
    if(!email) throw new ValidationError('Email is required')
    if(!new_password) throw new ValidationError('Password is required')
    if(!retyped) throw new ValidationError('Password is required')
    if(new_password !== retyped) throw new ValidationError("Passwords didn't match")
    let user = await User.findOne({email:email})
    if(!user)throw new HTTPError("User doesn't exists",404)
    if(await bcrypt.compare(new_password,user.password)) throw new ValidationError("New password can't be one of your old passwords")
    if(user.reset_verified == false) throw new ValidationError("It seems your account is not verified. Please verify your account with otp for changing password.")
    let hashedPassword = bcrypt.hashSync(new_password, 10);
    let updated = await User.updateOne({email:email},{password:hashedPassword,otp:"",reset_verified:true})
    if(!updated)throw('Something went wrong')
    return res.status(201).json({msg:"Password reset successful",type:"success",status:201})
  } catch (error) {
    console.log(error);
    if(error instanceof ValidationError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
    if(error instanceof HTTPError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
    return res.status(500).json({msg:"Something went wrong while reseting password",status:500,type:'error'}) 
  }
 }
   
}

export default AuthController;
