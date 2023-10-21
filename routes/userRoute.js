import express from "express";
import {
  deleteUser,
  forgotPassword,
  getAllUser,
  getUserDetails,
  loginUser,
  logout,
  registerUsers,
  resetPassword,
  singleUser,
  updatePassword,
  updateProfile,
  updateUserRole,
} from "../controller/userController.js";
import isAuthenticated, { authorizeRoles } from "../middleware/auth.js";

const router = express.Router();
// Authentication routes
router.route("/register").post(registerUsers);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/update").put(isAuthenticated, updatePassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logout);
// User routes
router.route("/me").get(isAuthenticated, getUserDetails);
router.route("/me/update").put(isAuthenticated, updateProfile);

//Admin routes

router
  .route("/admin/users")
  .get(isAuthenticated, authorizeRoles("admin"), getAllUser);
router
  .route("/admin/user/:id")
  .get(isAuthenticated, authorizeRoles("admin"), singleUser)
  .put(isAuthenticated, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteUser);

export default router;
