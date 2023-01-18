import User from "../../models/User.js ";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import HTTPError from "../../ErrorHandlers/HTTPExceptions.js";
dotenv.config();

export const authCheck = async (req, res, next) => {
  try {
    let token = req.cookies.jwtoken;
    if (!token) {
      throw("Unauthorized!. Token not found");
    }
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const rootUser = await User.findOne({ _id: verifyToken.id });
    if (!rootUser) {
      throw("User Not Found");
    }
    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id;
    next();
  } catch (error) {
    res.status(401).json({error:error});
  }
};

export const authorized = async (req,res,next)=>{
try {
  let token = req.cookies.jwtoken
  console.log(token)
  if(typeof token !== "undefined"){
    // console.log("hgh",req.cookies.jwtoken)
    const verifyToken = jwt.verify(req.cookies.jwtoken, process.env.JWT_SECRET_KEY);
    console.log(verifyToken.id)
    const rootUser = await User.findOne({ _id: verifyToken.id });
    console.log(rootUser)
    if(!rootUser)return res.status(400).json({msg:"Invalid Token",type:"error",status:400})
    if(!rootUser.verified)return res.status(400).json({msg:"Your Account is not verified",type:"error",status:400})
    return res.status(400).json({msg:"Already Loggedin",type:"error",status:400})  
  }else{
    next()
  }
} catch (error) {
  res.status(500).json({msg:"Something went Wrong",type:"error",status:500})
}
    
}

export const loggedIn = async(req,res,next)=>{
  try {
    const token = req.cookies.jwtoken
       if(token){
        throw new HTTPError("Another account is logged in.Please logout to continue",400)
       }else{
        next()
       } 
    
  } catch (error) {
        console.log(error);
        if(error instanceof ValidationError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        if(error instanceof HTTPError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        return res.status(500).json({msg:"Something went wrong while signing up!",status:500,type:'error'}) 
  }
}

export const generateOtp = ()=>{
  var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}


