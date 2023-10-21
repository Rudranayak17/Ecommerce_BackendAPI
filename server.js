
import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/database.js";
import  cloudinary from "cloudinary";
//Handling uncaught exceptions
process.on("uncaughtException",(err)=>{
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to:  uncaught exceptions`);
  process.exit(1)
})



//config
dotenv.config({
  path: "./config/config.env",
}); 

// connecting to  database
connectDB()
cloudinary.config({
  cloud_name:process.env.CLOUDINARY_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
})


const server =app.listen(process.env.PORT,()=>{
    console.log(`server listening on ${process.env.PORT}`);
})


// unhandled Promise Rejection

process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to: unhandled Rejections`);
    server.close(() => {
      process.exit(1);
    });
  });
  