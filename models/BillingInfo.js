import mongoose, { Schema } from "mongoose";
const orderSchema = mongoose.Schema({
    user_id:{type:mongoose.Schema.Types.ObjectId},
    products:[
        {productId :{type:Schema.Types.ObjectId}}
    ],
    total:{type:Number,required:true},
    discount:{type:Number},
    desc:{type:String,trime:true},
    status:{type:Boolean,default:1},
},{
    timestamps:true,
})

const orderModel = mongoose.model('orders',orderSchema)

export default orderModel