import mongoose, { Mongoose } from "mongoose";
const cartSchema = mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    products:[{product_id:{type: mongoose.Schema.Types.ObjectId, ref: 'products'},quantity:{type:Number},price:{type:Number}}],
    total_qty:{type:Number,required:true},
    total_price:{type:Number,required:true}
},{
    timestamps:true
})

const Cart = mongoose.model('cart',cartSchema)

export default Cart