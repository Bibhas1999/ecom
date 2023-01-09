import mongoose, { Schema } from "mongoose";
const categorySchema = mongoose.Schema({
    name:{type:String,required:"Category name is required",unique:true},
    subcategories:[{name:{type:String}}]
},{
    timestamps:true,
})

const categoryModel = mongoose.model('categories',categorySchema)

export default categoryModel