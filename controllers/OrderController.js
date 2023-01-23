import HTTPError from "../ErrorHandlers/HTTPExceptions.js"
import ValidationError from "../ErrorHandlers/ValidationExceptions.js"
import Order from "../models/Order.js"

export const getOrders = async (req,res)=>{
   try {
    const orders = await Order.find()
    if(orders.length ===0) throw new HTTPError("No Orders Found",404)
    return res.status(201).json({orders:orders,msg:"All Orders Fetched",status:201,type:"success"})
   } catch (error) {
    console.log(error)
        if(error instanceof ValidationError) return res.status(error.statusCode).json({orders:[],msg:error.messege,status:error.statusCode,type:'error'})
        if(error instanceof HTTPError) return res.status(error.statusCode).json({orders:[],msg:error.messege,status:error.statusCode,type:'error'})
        return res.status(500).json({orders:[],msg:"Something went wrong while fetching orders!",status:500,type:'error'}) 
   } 
}

export const getOrder = async ()=>{
   try {
      const {id} = req.body
      if(!id) throw new ValidationError("order id is required!")
      if(mongoose.isValidObjectId(id)==false) throw new ValidationError('Invalid order id');
      if(typeof id != "string") throw new ValidationError('order id must be a string');
      let order = await Order.findOne({_id:id})
      if(!order) throw HTTPError("No Order Found!",500) 
      return res.status(201).json({order:order,msg:"All Orders Fetched",status:201,type:"success"})
    } catch (error) {
      if(error instanceof ValidationError) return res.status(error.statusCode).json({order:{},msg:error.messege,status:error.statusCode,type:'error'})
      if(error instanceof HTTPError) return res.status(error.statusCode).json({order:{},msg:error.messege,status:error.statusCode,type:'error'})
      return res.status(500).json({order:{},msg:"Something went wrong while fetching orders!",status:500,type:'error'}) 
   } 
}

export const createOrder = async (req,res)=>{
   try {
    const {order_details,total_quantity,total,sub_total,desc,discount,date} = req.body
    if(!total_quantity) throw new ValidationError("Total Quantity is required")
    if(!sub_total) throw new ValidationError("Sub Total is required")
    if(!discount) discount = 0
    if(!total) throw new ValidationError("Order Total is required")
    if(!order_details || order_details.length === 0 )throw new ValidationError("Order details are required")
    if(order_details instanceof Array == false)throw new ValidationError("Order details must be an array")
    if(!date || data instanceof Date === false)throw new ValidationError("Date is either undefined or invalid")
    let order = new Order({
        order_details:order_details,
        total_quantity:total_quantity,
        total:total,
        sub_total:sub_total,
        desc:desc,
        discount:discount
    })
    let saved = await order.save()
    if(!saved)throw("Something went wrong")
    
    return res.status(201).json({msg:"Order Created Successfully",status:201,type:"success"})
   } catch (error) {
      if(error instanceof ValidationError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
      if(error instanceof HTTPError) return res.status(error.statusCode).json({msg:error.messege,status:error.statusCode,type:'error'})
      return res.status(500).json({msg:"Something went wrong while creating order!",status:500,type:'error'})
   }
}



export const updateOrder = async ()=>{
    
}

export const updateOrderStatus = async ()=>{
    
}

export const deleteOrders = async ()=>{
    
}

export const deleteOrder = async ()=>{
    
}
