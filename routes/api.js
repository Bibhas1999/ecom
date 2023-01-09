import express from 'express'
import UserController from '../controllers/UserController.js' 
import AuthController from '../controllers/AuthController.js' 
import {authCheck,authorized} from '../controllers/middlewares/auth_middleware.js'
import { getCategoryDetailsware,addCategoryware, updateCategoryware, deleteCategoryware, createProductware,deleteSubCatFromCategoryware } from '../controllers/middlewares/product_middleware.js'
import { getProducts,getProduct,getCategories, getCategory,addCategory,updateCategory, deleteCategory, createProduct, updateProduct, deleteSubCatFromCategory, createAttribute, updateAttribute, deleteAttribute, deleteValuesFromAttribute, getBrands, getBrand, addBrand, updateBrand, deleteBrand } from '../controllers/ProductController.js'

const router = express.Router();

//Auth routes
router.post('/register',AuthController.register)
router.post('/login',authorized,AuthController.login)
router.get('/logout',AuthController.logout)
router.post('/verify-account',AuthController.verifyAccount)
router.post('/resend-otp/',AuthController.resendOTP)
router.post('/forgot-password/',AuthController.forgotPassword)
router.post('/reset-password/',AuthController.resetPasswordVerify)
router.get('/users', authCheck,UserController.getUser)
router.post('/user/add',authCheck,UserController.addUser)
router.get('/user/edit/:id',UserController.editUser)
router.put('/user/update',UserController.updateUser)
router.get('/user/delete/:id',UserController.deleteUser)
router.post('/upload',UserController.uploadPic)

//product routes
router.get('/products', authCheck,getProducts)
router.post('/product',authCheck,getProduct)
router.post('/product/create',authCheck, createProductware,createProduct)
router.put('/product/update', authCheck,updateProduct)

//category routes
router.get('/categories', authCheck,getCategories)
router.post('/category', authCheck,getCategoryDetailsware,getCategory)
router.post('/category/create', authCheck,addCategoryware, addCategory)
router.put('/category/update', authCheck,updateCategoryware,updateCategory)
router.delete('/category/delete', authCheck,deleteCategoryware,deleteCategory)
router.delete('/subcategory/delete', authCheck,deleteSubCatFromCategoryware,deleteSubCatFromCategory)

//attribute routes
// router.post('/attribute/create', authCheck , createAttribute)
// router.put('/attribute/update', authCheck , updateAttribute)
// router.delete('/attribute/delete', authCheck , deleteAttribute)
// router.delete('/attribute/value/delete', authCheck , deleteValuesFromAttribute)

router.get('/brands', authCheck, getBrands)
router.get('/brand', authCheck, getBrand)
router.post('/brand/create', authCheck, addBrand)
router.put('/brand/update', authCheck, updateBrand)
router.delete('/brand/delete', authCheck, deleteBrand)

export default router