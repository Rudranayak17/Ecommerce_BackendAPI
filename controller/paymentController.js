
import { catchAsyncFunc } from "../middleware/catchAsyncErrors.js";
import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_SECRET);


export const processpayment=catchAsyncFunc(async(req,res,next)=>{
    const headers = {
        Authorization: process.env.STRIPE_API_SECRET,
    };
 
    const mypayment= await stripe.paymentIntents.create({
        amount:req.body.amount,
        currency:"inr",
        metadata:{
            company:"Ecommerce",
        }
        
    },
    headers.Authorization
   
    )
    res.status(200).json({success:true,client_secret:mypayment.client_secret})
})

export const sendStripeApiKey=catchAsyncFunc(async(req,res,next)=>{
   
    res.status(200).json({stripeApiKey:process.env.STRIPE_API_KEY})
})

