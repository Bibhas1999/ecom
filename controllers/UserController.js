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
      if(error instanceof ValidationError) return res.status(error.statusCode).json({user:{},msg:error.messege,status:error.statusCode,type:'error'})
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
      const { id, name, email, mobile, address } = req.body;
      if(!id) throw new ValidationError("id is required!")
      if(mongoose.isValidObjectId(id)==false) throw new ValidationError('Invalid id');
      if(typeof id != "string") throw new ValidationError('user id must be a string');
      const user = await User.findOne({ _id:id });
      if(!user) throw new HTTPError("No User Found!",404)
      let update = await User.updateOne({_id: id },{$set:{name:name,mobile:mobile,address:address}});
      if(!update) throw('Something went wrong')
      return res.json({msg:"Profile Updated Successfully",status:201,type:"success"})
    } catch (error) {
      if(error instanceof ValidationError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
      if(error instanceof HTTPError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
      return res.status(500).json({msg:"Something went wrong while updaing profile!",status:500,type:'error'}) 
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
    let update = await User.updateOne({email:email},{password:hashed})
    if(!update) throw new HTTPError("Something went wrong")
    return res.status(201).json({ msg: "Password Updated Successfully", status: 201 , type:"success" }); 
  } catch (error) {
    if(error instanceof ValidationError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
      if(error instanceof HTTPError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
      return res.status(500).json({msg:"Something went wrong while updating password!",status:500,type:'error'}) 
  }
  
}  
  static uploadPic = async (req, res) => {
    try {
      const {user_id} = req.body 
      let profile_pic = {}
      user_id = "63c7a388f7f1a6a4864768a0"
      if(!user_id) throw new ValidationError("Unauthenticated")
      let user = await User.findOne({_id:user_id})
      if(!user) throw new HTTPError("User Not Found",404)
      if(req.files){
        profile_pic = {
            name:req.files.image.name,
            file:req.files.image.data.toString('base64'),
            mimeType:req.files.image.mimetype
           }
        let update = await User.updateOne({_id:user_id},{$set: {profile_pic:profile_pic}})   
        if(!update) throw("Something went wrong")
        return res.status(201).json({ msg: "Profile Picture Added Successfully", status: 201 , type:"success" }); 
      } 
    } catch (error) {
      if(error instanceof ValidationError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
      if(error instanceof HTTPError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
      return res.status(500).json({msg:"Something went wrong while uploading profile pic!",status:500,type:'error'}) 
    }
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
