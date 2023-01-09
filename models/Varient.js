import mongoose from "mongoose";
const varientSchema = mongoose.Schema({
    name:{type:String},
    
    active:{type:Boolean,default:false},
})

const Varient = mongoose.model('varients',varientSchema)

export default Varient