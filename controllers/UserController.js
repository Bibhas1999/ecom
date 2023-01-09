import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from 'fs'
import mongoose from "mongoose";
import HTTPError from "../ErrorHandlers/HTTPExceptions.js";
import ValidationError from "../ErrorHandlers/ValidationExceptions.js";
class UserController {
  static getUser = async (req, res) => {
    try {
      const users = await User.find();
      if(!users) throw new HTTPError("No Users Found!",404)
      return res.json({ users: users, msg:"Users fetched", status:200, type:"success" });
    } catch (error) {
      if(error instanceof ValidationError) return res.status(error.statusCode).json({errors:error},{users:[],msg:error.messege,status:error.statusCode,type:'error'})
        if(error instanceof HTTPError) return res.status(error.statusCode).json({users:[],msg:error.messege,status:error.statusCode,type:'error'})
        return res.status(500).json({users:[],msg:"Something went wrong!",status:500,type:'error'}) 
    }
  };

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
      return res.send({ error: error, msg:"Something went wrong", status: 500, type:"error" });
    }
  };

  static editUser = async (req, res) => {
    try {
      const { id } = req.params;
      if(mongoose.isValidObjectId(id)==false) return res.status(400).json({msg:"Invalid user id",status:400,type:"error"})
      const user = await User.findOne({ _id: id });
      if (user) {
        console.log(user._id);
        const filtered = {
          id: user._id,
          name: user.name,
          email: user.email,
          active: user.active,
        };
        res.setHeader("Access-Control-Allow-Origin", "*");
        return res.send({ user: filtered, status: "200 ok" });
      }
      return res.send({ msg: "User Not Found", status: "400 Not Found" });
    } catch (error) {
      console.log(error);
      return res.send({ error: error, status: "500" });
    }
  };

  static updateUser = async (req, res) => {
    try {
      const { id, name, email } = req.body;
      const user = await User.findOne({ email: email });
      console.log(user);
      if (user) {
        await UserModel.updateOne({ name: name, email: email });
        return res.send({ msg: "User Updated Successfully", status: "200 ok" });
      } else {
        return res.send({ msg: "User Not Found", status: "400 Not Found" });
      }
    } catch (error) {
      return res.send({ error: error, status: "500" });
    }
  };

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
