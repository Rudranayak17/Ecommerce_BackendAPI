import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    pincode: {
      type: Number,
      required: true,
    },
    phoneNo: {
      type: Number,
      required: true,
    },
  },
  orderItem:[
    {
        name:{
            type:String,
            required:true,
        },
        price:{
            type:Number,
            required:true
        },
        quantity:{
            type:Number,
            required:true
        },
        image: {
        type: String,
        required: true,
      },

        product:{
            type:mongoose.Schema.ObjectId,
            ref:"Product",
            required:true
        }
    }
],
user:{
    type:mongoose.Schema.ObjectId,
    ref:"User",
    required:true
},
paymentInfo:{
    id:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true
    }
},
paidAt:{
    type:Date,
    required:true
},
itemPrice:{
    type:Number,
    required:true,
    default:0
},
TaxPrice:{
    type:Number,
    required:true,
    default:0
},
ShippingPrice:{
    type:Number,
    required:true,
    default:0
},
totalPrice:{
    type:Number,
    required:true,
    default:0
},
orderStatus:{
    type:String,
    required:true,
    default:"Processing"
},
deliveredAt:{
    type:Date
},
createdAt:{
    type:Date,
    default:Date.now(),
}
});

const Order=mongoose.model("Order",orderSchema)

export default Order