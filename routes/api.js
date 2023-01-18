import express from 'express'
import UserController from '../controllers/UserController.js' 
import AuthController from '../controllers/AuthController.js' 
import {authCheck,authorized, loggedIn} from '../controllers/middlewares/auth_middleware.js'
import { getCategoryDetailsware,addCategoryware,updateProductware, updateCategoryware, deleteCategoryware, createProductware,deleteSubCategoryware } from '../controllers/middlewares/product_middleware.js'
import { getProducts,getProduct,getCategories, getCategory,addCategory,updateCategory, deleteCategory, createProduct, updateProduct, deleteSubCategory, createAttribute, updateAttribute, deleteAttribute, deleteValuesFromAttribute, getBrands, getBrand, addBrand, updateBrand, deleteBrand, updateSubCatgory, addSubCategory } from '../controllers/ProductController.js'

const router = express.Router();

//Auth routes
router.post('/register',loggedIn ,AuthController.register)
router.post('/login',authorized,AuthController.login)
router.get('/logout',AuthController.logout)
router.post('/verify-account',AuthController.verifyAccount)
router.post('/verify-reset-password',loggedIn,AuthController.verifyResetOtp)
router.post('/resend-otp/',loggedIn,AuthController.resendOTP)
router.post('/forgot-password/',loggedIn,AuthController.forgotPassword)
router.post('/reset-password/',loggedIn,AuthController.resetPasswordVerify)
router.get('/users', authCheck,UserController.getUser)
router.post('/user/add',authCheck,UserController.addUser)
router.get('/user/edit/:id',UserController.editUser)
router.put('/user/update',UserController.updateUser)
router.get('/user/delete/:id',UserController.deleteUser)
router.post('/upload',UserController.uploadPic)

//product routes
router.get('/products',getProducts)
router.post('/product',getProduct)
router.post('/product/create',authCheck, createProductware,createProduct)
router.put('/product/update', authCheck,updateProductware, updateProduct)

//category routes
router.get('/categories',getCategories)
router.post('/category',getCategoryDetailsware,getCategory)
router.post('/category/create', authCheck,addCategoryware, addCategory)
router.put('/category/update', authCheck,updateCategoryware,updateCategory)
router.delete('/category/delete', authCheck,deleteCategoryware,deleteCategory)
router.post('/subcategory/create',authCheck,addSubCategory)
router.put('/subcategory/update',authCheck,updateSubCatgory)
router.delete('/subcategory/delete',authCheck,deleteSubCategoryware,deleteSubCategory)

//attribute routes
// router.post('/attribute/create', authCheck , createAttribute)
// router.put('/attribute/update', authCheck , updateAttribute)
// router.delete('/attribute/delete', authCheck , deleteAttribute)
// router.delete('/attribute/value/delete', authCheck , deleteValuesFromAttribute)

router.get('/brands', getBrands)
router.post('/brand', getBrand)
router.post('/brand/create', addBrand)
router.put('/brand/update', updateBrand)
router.delete('/brand/delete', deleteBrand)

export default router