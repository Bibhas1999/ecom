import mongoose, { Schema } from "mongoose";
const brandSchema = mongoose.Schema({
    name:{type:String,required:"Brand name is required",unique:true},
    subcat_id:{type:String,required:"Subcategory is required", ref:"categories.subcategory"}
},{
    timestamps:true,
})

const brandModel = mongoose.model('brands',brandSchema)

export default brandModel