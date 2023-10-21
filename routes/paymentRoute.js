import express from "express";
import isAuthenticated from "../middleware/auth.js";
import { processpayment, sendStripeApiKey } from "../controller/paymentController.js";

const router = express.Router();



router.route("/payment/process").post(isAuthenticated,processpayment)
router.route("/stripeapikey").get(isAuthenticated,sendStripeApiKey)
export default router
