import express from 'express'
import UserController from '../controllers/UserController.js' 
import AuthController from '../controllers/AuthController.js' 
import {authCheck,authorized, loggedIn} from '../controllers/middlewares/auth_middleware.js'
import { getCategoryDetailsware,addCategoryware,updateProductware, updateCategoryware, deleteCategoryware, createProductware,deleteSubCategoryware } from '../controllers/middlewares/product_middleware.js'
import { getProducts,getProduct,getCategories, getCategory,addCategory,updateCategory, deleteCategory, createProduct, deleteProduct, updateProduct, deleteSubCategory, createAttribute, updateAttribute, deleteAttribute, deleteValuesFromAttribute, getBrands, getBrand, addBrand, updateBrand, deleteBrand, updateSubCatgory, addSubCategory, addToCart, updateCartQuantity, CartList, removeFromCart } from '../controllers/ProductController.js'

const router = express.Router();

//Auth routes
router.post('/register',loggedIn ,AuthController.register)
router.post('/login',AuthController.login)
router.post('/logout',AuthController.logout)
router.post('/verify-account',AuthController.verifyAccount)
router.post('/verify-reset-password',loggedIn,AuthController.verifyResetOtp)
router.post('/resend-otp/',loggedIn,AuthController.resendOTP)
router.post('/forgot-password/',loggedIn,AuthController.forgotPassword)
router.post('/reset-password/',AuthController.resetPasswordVerify)
router.post('/change-password/',loggedIn,UserController.changePassword)
router.get('/users',UserController.getUsers)
router.post('/user',UserController.getUser)
router.post('/user/add',authCheck,UserController.addUser)
router.put('/user/update',UserController.updateUser)
router.get('/user/delete/:id',UserController.deleteUser)
router.post('/upload/profile-pic/',UserController.uploadPic)

//product routes
router.get('/products',getProducts)
router.post('/product',getProduct)
router.post('/product/create', createProductware,createProduct)
router.put('/product/update',updateProductware, updateProduct)
router.delete('/product/delete', deleteProduct)

//category routes
router.get('/categories',getCategories)
router.post('/category',getCategoryDetailsware,getCategory)
router.post('/category/create',addCategoryware, addCategory)
router.put('/category/update',updateCategoryware,updateCategory)
router.delete('/category/delete',deleteCategoryware,deleteCategory)
router.post('/subcategory/create',authCheck,addSubCategory)
router.put('/subcategory/update',authCheck,updateSubCatgory)
router.delete('/subcategory/delete',authCheck,deleteSubCategoryware,deleteSubCategory)

//cart routes
router.get("/cart", CartList)
router.post("/add-to-cart", addToCart)
router.put("/update-cart", updateCartQuantity)
router.delete("/remove-from-cart", removeFromCart)


//attribute routes
// router.post('/attribute/create' , createAttribute)
// router.put('/attribute/update' , updateAttribute)
// router.delete('/attribute/delete' , deleteAttribute)
// router.delete('/attribute/value/delete' , deleteValuesFromAttribute)

router.get('/brands', getBrands)
router.post('/brand', getBrand)
router.post('/brand/create', addBrand)
router.put('/brand/update', updateBrand)
router.delete('/brand/delete', deleteBrand)

export default router
