import mongoose, { Schema } from "mongoose";
const offerSchema = mongoose.Schema({
    title:{type:String,required:true},
    discount:{type:Number},
},{
    timestamps:true,
})

const offerModel = mongoose.model('offers',offerSchema)

export default offerModel