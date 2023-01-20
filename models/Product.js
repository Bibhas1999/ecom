import mongoose from "mongoose";
const productSchema = mongoose.Schema({
    name:{type:String,trim:true},
    poster:{name:{type:String},file:{type:Buffer},mimeType:{type:String}},
    images:[{name:{type:String},file:{type:Buffer},mimeType:{type:String}}],
    selling_quantity:{type:Number},
    in_qty:{type:Number},
    out_qty:{type:Number},
    price:{type:Number,trim:true},
    brand_id: {type: mongoose.Schema.Types.ObjectId, ref: 'brands'},
    desc:{type:String,trime:true},
    specifications:[
        {heading:{type:String},details:[{main_text:{type:String},desc:{type:String}}]}
    ],
    isVarient:{type:String,enum:['yes','no'],default:'no'},
    attribute:{type:Object},
    tags:[],
    offers:[{offer_id:{type:String}}],
    rating:{type:String},
    status:{type:Boolean,default:1},
},{
    timestamps:true,
})

const productModel = mongoose.model('products',productSchema)

export default productModel