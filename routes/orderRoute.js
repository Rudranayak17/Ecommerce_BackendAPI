import express from "express";

import isAuthenticated, { authorizeRoles } from "../middleware/auth.js";
import {
    deleteOrder,
  getAllOrder,
  getSingleOrder,
  myOrder,
  newOrder,
  updateOrder,
} from "../controller/orderController.js";
const router = express.Router();

router.route("/order/new").post(isAuthenticated, newOrder);
router.route("/order/:id").get(isAuthenticated, getSingleOrder);
router.route("/orders/me").get(isAuthenticated, myOrder);
router
  .route("/admin/orders")
  .get(isAuthenticated, authorizeRoles("admin"), getAllOrder);
router
  .route("/admin/order/:id")
  .put(isAuthenticated, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteOrder);

export default router;
