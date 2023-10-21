import Order from "../model/orderModel.js";
import { catchAsyncFunc } from "../middleware/catchAsyncErrors.js";
import Product from "../model/productModel.js";
import ErrorHandler from "../utils/errorhandler.js";

export const newOrder = catchAsyncFunc(async (req, res, next) => {
  const {
    shippingInfo,
    orderItem,
    paymentInfo,
    itemPrice,
    TaxPrice,
    ShippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItem,
    paymentInfo,
    itemPrice,
    TaxPrice,
    ShippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

//get single order item

export const getSingleOrder = catchAsyncFunc(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("Order not found with this id", 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
});

// get Logged in user Order
export const myOrder = catchAsyncFunc(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});
// get All   Order --Admin
export const getAllOrder = catchAsyncFunc(async (req, res, next) => {
  const order = await Order.find();

  let totalAmount = 0;

  order.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    order,
  });
});

// Update    Order  Status--Admin
export const updateOrder = catchAsyncFunc(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(
      new ErrorHandler("You have already delivered this product", 400)
    );
  }
  
  if(req.body.status==="Shipped"){

    order.orderItem.forEach(async (order) => {
      await updateStock(order.product, order.quantity);
    });
  }
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }
  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

// delete    Order --Admin
export const deleteOrder = catchAsyncFunc(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("Order not found with this id", 404));
  }
  await order.deleteOne();

  res.status(200).json({
    success: true,
  });
});
