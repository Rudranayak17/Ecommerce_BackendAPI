import express from "express";
import dotenv from "dotenv";
import product from "./routes/productRoute.js"
import user from "./routes/userRoute.js"
import order from "./routes/orderRoute.js"
import payment from "./routes/paymentRoute.js"
import { errorMiddleware } from "./middleware/error.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import fileUpload from "express-fileupload";


const app = express();

//Config
dotenv.config({path:"backend/config/config.env"})

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(cors({
    origin:[process.env.FONTEND_URL],
    methods:['GET', 'POST','PUT','DELETE'],
    credentials:true    
}))

//Route Imports
app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);
app.use("/api/v1",payment);


//middleware for error handling
app.use(errorMiddleware)

app.get("/", (req, res) => {
    res.send(" Server is working ");
  });



 export default app 


