import mongoose, { Mongoose } from "mongoose";
const cartSchema = mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    product_id:{type: mongoose.Schema.Types.ObjectId, ref: 'products'},
    quantity:{type:Number,required:true},
    price:{type:Number,required:true}
},{
    timestamps:true
})

const Cart = mongoose.model('cart',cartSchema)

export default Cart