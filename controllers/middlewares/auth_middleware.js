import User from "../../models/User.js ";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
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
  if(req.cookies.jwtoken){
    const verifyToken = jwt.verify(req.cookies.jwtoken, process.env.JWT_SECRET_KEY);
    const rootUser = await User.findOne({ _id: verifyToken.id });
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

export const generateOtp = ()=>{
  var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}


