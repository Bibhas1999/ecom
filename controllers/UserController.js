import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from 'fs'
import mongoose from "mongoose";
import HTTPError from "../ErrorHandlers/HTTPExceptions.js";
import ValidationError from "../ErrorHandlers/ValidationExceptions.js";
class UserController {

  static getUsers = async (req, res) => {
    try {
      const users = await User.find();
      if(users.length == 0) throw new HTTPError("No Users Found!",404)
      return res.status(201).json({ users: users, msg:"Users fetched", status:200, type:"success" });
    } catch (error) {
      if(error instanceof ValidationError) return res.status(error.statusCode).json({errors:error},{users:[],msg:error.messege,status:error.statusCode,type:'error'})
      if(error instanceof HTTPError) return res.status(error.statusCode).json({users:[],msg:error.messege,status:error.statusCode,type:'error'})
      return res.status(500).json({users:[],msg:"Something went wrong!",status:500,type:'error'}) 
    }
  };

  static getUser = async (req,res)=>{
    try {
      const {id} = req.body
      if(!id) throw new ValidationError("user id is required!")
      if(mongoose.isValidObjectId(id)==false) throw new ValidationError('Invalid id');
      if(typeof id != "string") throw new ValidationError('user id must be a string');
      let user = await User.findOne({_id:id})
      if(!user) throw HTTPError("No User Found!",500)
      return res.status(201).json({ user: user, msg:"User Fetched", status:201, type:"success" })
    } catch (error) {
      if(error instanceof ValidationError) return res.status(error.statusCode).json({errors:error},{user:{},msg:error.messege,status:error.statusCode,type:'error'})
      if(error instanceof HTTPError) return res.status(error.statusCode).json({user:{},msg:error.messege,status:error.statusCode,type:'error'})
      return res.status(500).json({user:{},msg:"Something went wrong!",status:500,type:'error'}) 
    }
  }



  static addUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if(!name)throw new ValidationError("username is required!")
      if(!email)throw new ValidationError("email is required!")
      if(!password)throw new ValidationError("password is required!")
      
      const result = await User.findOne({ email: email });
      if (!result) {
        let hashedPassword = bcrypt.hashSync(password, 10);
        const user = new User({
          name: name,
          email: email,
          password: hashedPassword,
        });
        await user.save();
        return res.json({ msg: "User Added Successfully", status:200,type:"success" });
      }
      return res.json({ msg: "Email already exists", status: 400,type:"error" });
    } catch (error) {
      if(error instanceof ValidationError) return res.status(error.statusCode).json({user:{},msg:error.messege,status:error.statusCode,type:'error'})
      if(error instanceof HTTPError) return res.status(error.statusCode).json({user:{},msg:error.messege,status:error.statusCode,type:'error'})
      return res.status(500).json({user:{},msg:"Something went wrong!",status:500,type:'error'}) 
    }
  };


  static updateUser = async (req, res) => {
    try {
      const { id, name, email } = req.body;
      if(!id) throw new ValidationError("id is required!")
      if(mongoose.isValidObjectId(id)==false) throw new ValidationError('Invalid id');
      if(typeof id != "string") throw new ValidationError('user id must be a string');
      const user = await User.findOne({ _id:id });
      if (user) {
        await User.updateOne({ name: name, email: email });
        return res.send({ msg: "User Updated Successfully", status: "200 ok" });
      } else {
        return res.send({ msg: "User Not Found", status: "400 Not Found" });
      }
    } catch (error) {
      if(error instanceof ValidationError) return res.status(error.statusCode).json({user:{},msg:error.messege,status:error.statusCode,type:'error'})
      if(error instanceof HTTPError) return res.status(error.statusCode).json({user:{},msg:error.messege,status:error.statusCode,type:'error'})
      return res.status(500).json({user:{},msg:"Something went wrong!",status:500,type:'error'}) 
    }
  };

static changePassword = async (req,res)=>{
  try {
    const {email,curr_password,new_password,retyped} = req.body
    if(!email)throw new ValidationError("Email is required")
    if(!curr_password)throw new ValidationError("Password is required")
    if(!new_password)throw new ValidationError("Please provide new password")
    if(!retyped)throw new ValidationError("Please retype your new password")
    if(new_password !== retyped) throw new ValidationError("password and confirm password doesn't match")
    let user = await User.findOne({email:email})
    if(!user)throw new HTTPError("No user found!",404)
    if(!bcrypt.compareSync(curr_password,user.password)) throw new HTTPError("Your current password is wrong!")
    let hashed = bcrypt.hashSync(new_password,10)
    
    
  } catch (error) {
    if(error instanceof ValidationError) return res.status(error.statusCode).json({user:{},msg:error.messege,status:error.statusCode,type:'error'})
      if(error instanceof HTTPError) return res.status(error.statusCode).json({user:{},msg:error.messege,status:error.statusCode,type:'error'})
      return res.status(500).json({user:{},msg:"Something went wrong!",status:500,type:'error'}) 
  }
  
}  
  static uploadPic = async (req, res) => {
    
  };
  static removePic = async (req, res) => {
    if (req.file) {
      return res.send({
        name: req.file.filename,
      });
    }
  };
  static deleteUser = async (req, res) => {
    try {
      const id = req.params.id;
      if (typeof id != "undefined") {
        await User.findByIdAndDelete(id);
        return res.send({ msg: "User Deleted Successfully", status: "200 ok" });
      }
    } catch (error) {
      return res.send({ error: error, status: "500" });
    }
  };
}
export default UserController;
