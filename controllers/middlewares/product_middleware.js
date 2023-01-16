import Product from "../../models/Product.js";
import Category from "../../models/Category.js";
import ValidationError from "../../ErrorHandlers/ValidationExceptions.js";
import HTTPError from "../../ErrorHandlers/HTTPExceptions.js";
import mongoose from "mongoose";


export const getCategoryDetailsware = (req,res,next) =>{
    try {
       const {id} = req.body
       if(!id)throw new ValidationError('Category id must be filled');
       if(mongoose.isValidObjectId(id)==false) throw new ValidationError('Invalid category id');
       if(typeof id != "string") throw new ValidationError('id must be a string');
       next()
    } catch (error) {
        if(error instanceof ValidationError) return res.status(error.statusCode).json({category:{},msg:error.messege,status:error.statusCode,type:'error'})
        if(error instanceof HTTPError) return res.status(error.statusCode).json({category:{},msg:error.messege,status:error.statusCode,type:'error'})
        return res.status(500).json({category:{},msg:"Something went wrong",status:500,type:'error'})
    }
}

export const addCategoryware = (req,res,next) =>{
    try {
       const {name, subcategories} = req.body
       
       if(!name)throw new ValidationError('Category name is required');
       if(typeof name != "string") throw new ValidationError('Ctaegory name must be a string');
       if(subcategories instanceof Array == false) throw new ValidationError('Subcatgories must be an array')
       next()
    } catch (error) {
        if(error instanceof ValidationError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        if(error instanceof HTTPError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        return res.status(500).json({msg:"Something went wrong",status:500,type:'error'})
    }
}

 export const updateCategoryware = (req,res,next) =>{
    try {
        const {id, name, subcategories} = req.body

       if(!id)throw new ValidationError('Category id must be filled');
       if(mongoose.isValidObjectId(id)==false) throw new ValidationError('Invalid category id');
       if(typeof id != "string") throw new ValidationError('id must be a string');
       if(subcategories instanceof Array == false) throw new ValidationError('Subcatgories must be an array')
        next()
     } catch (error) {
         if(error instanceof ValidationError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
         if(error instanceof HTTPError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
         return res.status(500).json({msg:"Something went wrong",status:500,type:'error'})
     }
 }

 export const deleteCategoryware = (req,res,next) =>{
    try {
        const {id} = req.body
       if(!id)throw new ValidationError('Category id must be filled');
       if(mongoose.isValidObjectId(id)==false) throw new ValidationError('Invalid category id');
       if(typeof id != "string") throw new ValidationError('id must be a string');
        next()
     } catch (error) {
         if(error instanceof ValidationError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
         if(error instanceof HTTPError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
         return res.status(500).json({msg:"Something went wrong",status:500,type:'error'})
     }
 }

 export const deleteSubCatFromCategoryware = (req,res,next) =>{
    try {
        const {cat_id,id} = req.body
       if(!cat_id)throw new ValidationError('Category id must be filled');
       if(mongoose.isValidObjectId(cat_id)==false) throw new ValidationError('Invalid category id');
       if(typeof cat_id != "string") throw new ValidationError('id must be a string');
       if(!id)throw new ValidationError('Sub category id must be filled');
       if(mongoose.isValidObjectId(id)==false) throw new ValidationError('Invalid sub category id');
       if(typeof id != "string") throw new ValidationError('id must be a string');
        next()
     } catch (error) {
         if(error instanceof ValidationError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
         if(error instanceof HTTPError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
         return res.status(500).json({msg:"Something went wrong",status:500,type:'error'})
     }
 }

 export const createProductware = (req,res,next)=>{
    
    try {
        const {name,price,selling_quantity,desc,brand_id,isVarient,attribute} = req.body
        if(!name)throw new ValidationError('Product Name is required'); 
        if(typeof name != "string")throw new ValidationError('Name must be a string');
        if(!price)throw new ValidationError('Product price is required');
        // if(typeof price != "number")throw new ValidationError('Price must be a number');
        if(price < 0)throw new ValidationError('Price must be greater than or equal to 0');
        if(!selling_quantity)throw new ValidationError('Selling quantity is required');
        // if(typeof selling_quantity != "number")throw new ValidationError('Selling quantity must be a number');
        if(selling_quantity < 0)throw new ValidationError('Selling quantity must be greater than or equal to 0');
        if(!desc)throw new ValidationError('Description is required')
        if(isVarient){
            if(!attribute)throw new ValidationError('Varient products must have at least 1 attribute');
        }
        if(typeof isVarient !="string" )throw new ValidationError("IsVarient must be a string")
        if(!brand_id)throw new ValidationError('Brand id must be filled');
        if(mongoose.isValidObjectId(brand_id)==false) throw new ValidationError('Invalid brand id');
        if(typeof brand_id != "string") throw new ValidationError('brand id must be a string'); 

        next()
    } catch (error) {
        console.log(error)
        if(error instanceof ValidationError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        if(error instanceof HTTPError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
        return res.status(500).json({msg:"Something went wrong!",status:500,type:'error'}) 
    }

 }

 export const updateProductware = (req,res,next)=>{
    
 }