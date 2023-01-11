import Product from "../models/Product.js"
import Category from "../models/Category.js";
import mongoose from "mongoose";
import fs from 'fs'
import HTTPError from "../ErrorHandlers/HTTPExceptions.js";
import ValidationError from "../ErrorHandlers/ValidationExceptions.js";
import File from "../models/File.js";
import Attribute from "../models/Attribute.js";
import Brand from "../models/Brand.js";
export const getProducts = async (req,res)=>{
   try {
     let products = await Product.find();
     if(products?.length == 0) return res.status(404).json({products:[],msg:"No Products Found",status:404,type:"error"})
     return res.status(201).json({products:products,msg:"Products fetched successfully",status:201,type:"success"})
   } catch (error) {
     return res.status(500).json({products:[],msg:"Something went wrong",status:500,type:"error"})
   }
}

export const getProduct = async (req,res)=>{
    try {
        const {id} = req.body

        if(!id) return res.status(400).json({product:[],msg:null,status:400,error:"Product id is required"})

        if(mongoose.isValidObjectId(id)==false) return res.status(400).json({product:[],msg:"Invalid product id",status:400,type:"error"})

        let product = await Product.findOne({_id:id})

        if(!product) return res.status(404).json({product:[],msg:"No Product Found",status:404,type:"error"})

    } catch (error) {
        return res.status(500).json({product:[],msg:"Something went wrong!",status:500,type:"error"})
    }
}

export const createProduct = async (req,res) =>{
    try {
       const {name,price,selling_quantity,desc,brand_id,attribute,rating,reviews,specifications,isVarient,images} = req.body
       let exist = await Brand.findOne({_id:brand_id})
       if(!exist)throw new HTTPError("No brand found",404)
       let poster = {}
       if(req.files){
        poster = {
            name:req.files.image.name,
            file:req.files.image.data.toString('base64'),
            mimeType:req.files.image.mimeType
           }
       }       
      
       let product = new Product({
         name:name,
         poster:poster,
         price:price,
         selling_quantity:selling_quantity,
         desc:desc,
         brand_id:brand_id,
         attribute:JSON.parse(attribute),
         isVarient:isVarient,
         rating:rating,
         reviews:reviews,
         specifications:JSON.parse(specifications),
       })
       let saved = await product.save()
       if(!saved) throw("Something went wrong!")
       return res.status(200).json({msg:"Product Added Successfully",status:200,type:"success"})
    } catch (error) {
         console.log(error)
        if(error instanceof ValidationError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        if(error instanceof HTTPError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        return res.status(500).json({msg:"Something went wrong while adding product!",status:500,type:'error'}) 
    }

}



export const updateProduct = async (req,res)=>{
const {name,price,selling_quantity,desc,brand_id,attribute,rating,reviews,specifications,isVarient} = req.body

}


export const deleteProduct = async ()=>{
    
}

export const getCategories = async (req,res)=>{
  try {
    let categories = await Category.find()
    if(categories?.length == 0)throw new HTTPError('No Categories Found',404)
    res.status(201).json({categories:categories,msg:"All categories fetched!", status:201,type:"success"})
  } catch (error) {
    if(error instanceof ValidationError) return res.status(error.statusCode).json({errors:error},{category:[],msg:error.messege,status:error.statusCode,type:'error'})
    if(error instanceof HTTPError) return res.status(error.statusCode).json({category:[],msg:error.messege,status:error.statusCode,type:'error'})
     return res.status(500).json({category:[],msg:"Something went wrong!",status:500,type:'error'}) 
  }
}
export const getCategory = async (req,res)=>{
    try {
        const {id} = req.body   
        let category = await Category.findOne({_id:id})
        if(!category) throw new HTTPError('No Category Found',404)
        return res.status(201).json({category:category,msg:"Category fetched",status:201,type:'success'})
    } catch (error) {
        if(error instanceof ValidationError) return res.status(error.statusCode).json({errors:error},{category:{},msg:error.messege,status:error.statusCode,type:'error'})
        if(error instanceof HTTPError) return res.status(error.statusCode).json({category:{},msg:error.messege,status:error.statusCode,type:'error'})
        return res.status(500).json({category:{},msg:"Something went wrong!",status:500,type:'error'}) 
    }
  }

export const addCategory = async(req,res)=>{
    try {
        const {name,subcategories} = req.body
        let categories = await Category.find()
        let filtered = categories.filter(item => item.name == name )
        if(filtered.length !=0)throw new ValidationError("Category name must be unique")
        let sub_filter = categories.map(cat => cat.subcategories.filter(item => subcategories.some(elem => elem.name == item.name)))
        if(sub_filter[0].length !=0)throw new ValidationError("Subcategories must be unique")
        let category = new Category({
            name:name,
            subcategories:subcategories,
        })
        let saved = await category.save()
        if(!saved)throw ("Something went wrong while adding categories!")
        return res.status(200).json({msg:"Category Added Successfully",status:200,type:"success"})
    } catch (error) {
        console.log(error)
        if(error instanceof ValidationError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        if(error instanceof HTTPError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        return res.status(500).json({msg:"Something went wrong while adding categories!",status:500,type:'error'}) 
    }
}  

export const updateCategory = async (req,res)=>{
    try {
        const {id,name,subcategories} = req.body

        let categories = await Category.find()
        let filtered_cat = categories.filter(item => item._id != id && item.name == name )
        if(filtered_cat.length !=0)throw new ValidationError("Category name must be unique")

        let category = await Category.findOne({_id:id})
        if(!category) throw new HTTPError('No Category Found',404)
        let cat_name,sub_cat
        if(typeof name=="undefined" || name == ""){
            cat_name=category.name
        }else{
            cat_name=name 
        }
        if(subcategories?.length == 0){
            sub_cat=[...category.subcategories]
        }else{
            sub_cat=[...subcategories,...category.subcategories] 
        }
        let filtered = category.subcategories.filter(item => subcategories.some(elem => elem.name == item.name))
        if(filtered.length !=0)throw new ValidationError("Subcategories must be unique")
        let update = await Category.updateOne({_id:id},{name:cat_name,subcategories:sub_cat})
        if(!update)throw("Somthing went wrong")
        return res.status(200).json({msg:"Category Updated Successfully",status:200,type:"success"})
    } catch (error) {
        console.log(error)
        if(error instanceof ValidationError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        if(error instanceof HTTPError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        return res.status(500).json({msg:"Something went wrong while updating categories!",status:500,type:'error'}) 
    }
}

export const deleteCategory = async(req,res)=>{
    try {
        const {id} = req.body
        let category = await Category.findOne({_id:id})
        if(!category) throw new HTTPError('No Category Found',404)
        let deleted = await Category.deleteOne({_id:category._id})
        if(!deleted)throw("Somthing went wrong")
        return res.status(200).json({msg:"Category Deleted Successfully",status:200,type:"success"})
    } catch (error) {
        console.log(error)
        if(error instanceof ValidationError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        if(error instanceof HTTPError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        return res.status(500).json({msg:"Something went wrong while deleting categories!",status:500,type:'error'}) 
    }
}

export const deleteSubCatFromCategory = async (req,res)=>{
    try {
        const {cat_id,id} = req.body
        let category = await Category.findOne({_id:cat_id})
        if(!category) throw new HTTPError('No Category Found',404)
        let subcategory = category.subcategories.filter(item => item._id == id)
        if(subcategory.length ==0) throw new HTTPError('No Sub Category Found',404)
        let deleted = await Category.updateOne({_id:cat_id},{$pull:{"subcategories":{"_id":id}}})
        if(!deleted)throw("Somthing went wrong")
        return res.status(200).json({msg:"Sub Category Deleted Successfully",status:200,type:"success"})
    } catch (error) {
        console.log(error)
        if(error instanceof ValidationError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        if(error instanceof HTTPError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        return res.status(500).json({msg:"Something went wrong while deleting subcategory!",status:500,type:'error'}) 
    }
}

export const createAttribute = async (req,res)=>{
    try {
       const {name,values} = req.body
       if(!name)throw new ValidationError('Attribute name is required'); 
       if(typeof name != "string")throw new ValidationError('Attribute name must be a string');
       if(values instanceof Array == false) throw new ValidationError('Arrtibute values must be an array')
       if(values.length == 0 ) throw new ValidationError('Atrribute must have at least one value')
       let attributes = await Attribute.find()
       let filtered = attributes.filter(item => item.name == name )
        if(filtered.length !=0)throw new ValidationError("Attribute name must be unique")

       let attribute = new Attribute({
        name:name,
        values:values
       })
       let saved = await attribute.save()
       if(!saved)throw("Somthing went wrong")
       return res.status(200).json({msg:"Attribute Added Successfully",status:200,type:"success"})
    } catch (error) {
        console.log(error)
        if(error instanceof ValidationError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        if(error instanceof HTTPError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        return res.status(500).json({msg:"Something went wrong while adding attribute!",status:500,type:'error'}) 
    }
}

export const updateAttribute = async(req,res) =>{
  try {
    const {id, name, values} = req.body
    let attributes = await Attribute.find()
    let attribute = await Attribute.findOne({_id:id})
    if(!attributes) throw new HTTPError('No Attributes Found',404)
    if(!attribute) throw new HTTPError('No Attribute Found',404)
    if(!id)throw new ValidationError('Attribute id must be filled');
    if(mongoose.isValidObjectId(id)==false) throw new ValidationError('Invalid attribute id');
    if(typeof id != "string") throw new ValidationError('id must be a string');
    if(typeof name != "string") throw new ValidationError('Attribute name must be a string');
    if(values instanceof Array == false) throw new ValidationError('Attribute values must be an array')

    let filtered = attributes.filter(item => item._id != id && item.name == name )
    if(filtered.length !=0)throw new ValidationError("Attribute name must be unique")
    let val_filter = attribute.values.filter(val => values.some(vl => vl == val))
    if(val_filter !=0)throw new ValidationError("Attribute values must be unique")
    let new_values = [...values,...attribute.values]
    let update = await Attribute.updateOne({_id:id},{name:name,values:new_values})
    if(!update)throw("Somthing went wrong")
    return res.status(200).json({msg:"Attribute Updated Successfully",status:200,type:"success"})
  } catch (error) {
    console.log(error)
        if(error instanceof ValidationError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        if(error instanceof HTTPError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        return res.status(500).json({msg:"Something went wrong while updating attribute!",status:500,type:'error'}) 
  }
}

export const deleteAttribute = async (req,res)=>{
    try {
        const {id} = req.body
        if(!id)throw new ValidationError('Attribute id must be filled');
        if(mongoose.isValidObjectId(id)==false) throw new ValidationError('Invalid attribute id');
        if(typeof id != "string") throw new ValidationError('id must be a string'); 
        let deleted = await Attribute.deleteOne({_id:id})
        if(!deleted)throw("Somthing went wrong")
        return res.status(200).json({msg:"Attribute Deleted Successfully",status:200,type:"success"})
    } catch (error) {
        console.log(error)
        if(error instanceof ValidationError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        if(error instanceof HTTPError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        return res.status(500).json({msg:"Something went wrong while deleting attribute!",status:500,type:'error'})  
    }
    
}

export const deleteValuesFromAttribute = async (req,res)=>{
    try {
        const {id,value} = req.body
        if(!id)throw new ValidationError('Attribute id must be filled');
        if(mongoose.isValidObjectId(id)==false) throw new ValidationError('Invalid attribute id');
        if(typeof id != "string") throw new ValidationError('id must be a string'); 
        if(!value)throw new ValidationError('Attribute value must be filled');
        if(typeof value != "string") throw new ValidationError('value must be a string'); 
        let attribute = await Attribute.findOne({_id:id})
        if(!attribute)throw new HTTPError('Attribute Not Found',404);
        let contain = attribute.values.filter(val => val === value)
        if(!contain)throw new HTTPError('No attribute value found',404);
        let new_values = attribute.values.filter(val => val !== value)
        console.log(new_values)
        let deleted = await Attribute.updateOne({_id:id},{values:new_values})
        if(!deleted)throw("Somthing went wrong")
        return res.status(200).json({msg:"Attribute value deleted successfully",status:200,type:"success"})
    } catch (error) {
        console.log(error)
        if(error instanceof ValidationError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        if(error instanceof HTTPError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        return res.status(500).json({msg:"Something went wrong while deleting values from attribute!",status:500,type:'error'})  
    }
}

export const getBrands = async (req,res)=>{
    try {
        let brands = await Brand.find();
        if(brands.length == 0)throw new HTTPError('No Brands Found',404)
        res.status(201).json({brands:brands,msg:"All brands fetched!", status:201,type:"success"})
    } catch (error) {
        console.log(error)
        if(error instanceof ValidationError) return res.status(error.statusCode).json({brands:[],msg:error.messege,status:error.statusCode,type:'error'})
        if(error instanceof HTTPError) return res.status(error.statusCode).json({brands:[],msg:error.messege,status:error.statusCode,type:'error'})
        return res.status(500).json({brands:[],msg:"Something went wrong",status:500,type:'error'})  
    }
}

export const getBrand = async (req,res)=>{
    try {
        const {id} = req.body
        if(!id)throw new ValidationError('Brand id must be filled');
        if(mongoose.isValidObjectId(id)==false) throw new ValidationError('Invalid brand id');
        if(typeof id != "string") throw new ValidationError('brand id must be a string'); 
        let brand = await Brand.findOne({_id:id});
        if(!brand)throw new HTTPError('No Brand Found',404)
        res.status(201).json({brand:brand,msg:"Brand fetched", status:201,type:"success"})
    } catch (error) {
        console.log(error)
        if(error instanceof ValidationError) return res.status(error.statusCode).json({brand:{},msg:error.messege,status:error.statusCode,type:'error'})
        if(error instanceof HTTPError) return res.status(error.statusCode).json({brand:{},msg:error.messege,status:error.statusCode,type:'error'})
        return res.status(500).json({brand:{},msg:"Something went wrong",status:500,type:'error'})  
    }
}

export const addBrand = async (req,res)=>{
    try {
      const {name, subcat_id} = req.body
      if(!subcat_id)throw new ValidationError('Subcategory id must be filled');
      if(mongoose.isValidObjectId(subcat_id)==false) throw new ValidationError('Invalid subcaetgory id');
      if(typeof subcat_id != "string") throw new ValidationError('Subcategory id must be a string'); 
      if(!name)throw new ValidationError('Brand name is required'); 
      if(typeof name !== "string")throw new ValidationError('Brand name must be a string'); 
      let categories = await Category.find()
      let subcat = categories.map(cat => cat.subcategories.filter(sc => sc._id == subcat_id))
      if(subcat[0].length == 0)throw new HTTPError('No Subcategory found',404);
      let exist = await Brand.findOne({name:name})
      if(exist) throw new ValidationError("A brand with this name already exist")
      let brand = new Brand({
        name:name,
        subcat_id:subcat_id
      })
      let saved = await brand.save()
      if(!saved)throw("Something went wrong")
      res.status(201).json({msg:"Brand added successfully", status:201,type:"success"})
    } catch (error) {
        console.log(error)
        if(error instanceof ValidationError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        if(error instanceof HTTPError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        return res.status(500).json({msg:"Something went wrong while adding brand",status:500,type:'error'}) 
    }
}

export const updateBrand = async (req,res)=>{
    try {
      const {id,name, subcat_id} = req.body
      if(!name)throw new ValidationError('Brand name is required'); 
      if(typeof name !== "string")throw new ValidationError('Brand name must be a string'); 
      if(!id)throw new ValidationError('Brand id must be filled');
      if(mongoose.isValidObjectId(id)==false) throw new ValidationError('Invalid brand id');
      if(typeof id != "string") throw new ValidationError('id must be a string');
      if(!subcat_id)throw new ValidationError('Subcategory id must be filled');
      if(mongoose.isValidObjectId(subcat_id)==false) throw new ValidationError('Invalid subcaetgory id');
      if(typeof subcat_id != "string") throw new ValidationError('Subcategory id must be a string'); 
      let brand = await Brand.findOne({_id:id})
      if(!brand) throw new HTTPError("Brand Not Found",404)
      if(typeof name == "undefined" || name ==""){
        name = brand.name
      }
      let update = await Brand.updateOne({_id:id},{name:name,subcat_id:subcat_id});
      if(!update)throw("Something went wrong")
      res.status(201).json({msg:"Brand updated successfully", status:201,type:"success"})
    } catch (error) {
        if(error instanceof ValidationError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        if(error instanceof HTTPError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        return res.status(500).json({msg:"Something went wrong while updating brand",status:500,type:'error'}) 
    }
}

export const deleteBrand = async (req,res)=>{
    try {
        const {id} = req.body
        if(!id)throw new ValidationError('Brand id must be filled');
        if(mongoose.isValidObjectId(id)==false) throw new ValidationError('Invalid brand id');
        if(typeof id != "string") throw new ValidationError('id must be a string'); 
        let deleted = await Brand.deleteOne({_id:id})
        if(!deleted)throw("Somthing went wrong")
        return res.status(200).json({msg:"Brand Deleted Successfully",status:200,type:"success"})
    } catch (error) {
        console.log(error)
        if(error instanceof ValidationError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        if(error instanceof HTTPError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        return res.status(500).json({msg:"Something went wrong while deleting brand!",status:500,type:'error'})  
    }
    
}

export const addToCart = async ()=>{
    
}

export const removeFromCart = async ()=>{
    
}


