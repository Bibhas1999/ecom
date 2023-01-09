import mongoose from "mongoose";
const attributeSchema = mongoose.Schema({
    name:{type:String,unique:true},
    values:[]
})

const Attribute = mongoose.model('attributes',attributeSchema)

export default Attribute