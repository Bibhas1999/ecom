import mongoose, { Schema } from "mongoose";
const orderSchema = mongoose.Schema({
    user_id:{type:mongoose.Schema.Types.ObjectId},
    order_details:{type:Array},
    total:{type:Number,required:true},
    sub_total:{type:Number},
    date:{type:Date,required:true},
    discount:{type:Number},
    desc:{type:String,trim:true},
    status:{type:String,enum : ['Placed','Shipped','Delivered','Pending'],default:'Pending'},
},{
    timestamps:true,
})

const Order = mongoose.model('orders',orderSchema)

export default Order