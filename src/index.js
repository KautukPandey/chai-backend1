// require('dotenv').config()
import connectDB from "./db/index.js";

import {app} from "./app.js"
import dotenv from "dotenv"
dotenv.config({
    path: './env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT||8000, ()=>{
        console.log(`Server is running at ${process.env.PORT}`);
        
    })
})
.catch((err)=>{
    console.log("MOngoDB connection failed !!",err);
    
})











/*
import express from "express"
const app = express()
(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("Errr ",error);
            throw error
        })
        app.listen(process.env.PORT,()=>{
            console.log(`Connected on port ${process.env.PORT}`);
            
        })
    } catch (error) {
        console.error("Error ", error);
        throw error
    }
})()
*/