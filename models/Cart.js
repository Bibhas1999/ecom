import mongoose, { Mongoose } from "mongoose";
const cartSchema = mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    products:[{product_id:{type: mongoose.Schema.Types.ObjectId, ref: 'products'},quantity:{type:Number},price:{type:Number}}],
    total_quantity:{type:Number,required:true},
    tottal_price:{type:Number,required:true}
},{
    timestamps:true
})

const Cart = mongoose.model('cart',cartSchema)

export default Cart