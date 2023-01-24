import express from 'express'
import db from './config/db.js'
import ejs from 'ejs'
import api from './routes/api.js'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import fileUpload from 'express-fileupload'
dotenv.config()
const port = process.env.PORT || 4000
const app = express()

app.set('view-engine',ejs)
app.use(helmet());
app.use(cookieParser())
app.use(express.static( "public" ));
app.use(express.urlencoded({ extended:true}));
app.use(express.json({extended: false}));
app.use(cors({ origin:"*", credentials:true }))
app.use(fileUpload())
app.use('/api',api)
app.listen(port,()=>{
    console.log('App is running on port '+`${port}`)
})