import User from "../model/user.js";
import ErrorHandler from "../utils/errorhandler.js";
import { catchAsyncFunc } from "../middleware/catchAsyncErrors.js";
import bcrypt from "bcryptjs";
import sendToken from "../utils/jwtToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import cloudinary from "cloudinary";

// Register a User

export const registerUsers = catchAsyncFunc(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  sendToken(user, 201, res);
});
//Login User

export const loginUser = catchAsyncFunc(async (req, res, next) => {
  const { email, password } = req.body;

  // check if user is already

  if (!email || !password) {
    return next(new ErrorHandler("Enter All the fields ", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("invalid email or password", 401));
  }

  const ispasswordMatched = await bcrypt.compare(password, user.password);
  if (!ispasswordMatched) {
    return next(new ErrorHandler("invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

//Logout

export const logout = catchAsyncFunc(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logout successfully",
  });
});

//Forgot Password

export const forgotPassword = catchAsyncFunc(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  //get resetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: true });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = `Your password has been reset token is :- \n\n ${resetPasswordUrl}\n\n If you have not requested then ,plz ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email Sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: true });

    return next(new ErrorHandler(error.message, 500));
  }
});

export const resetPassword = catchAsyncFunc(async (req, res, next) => {
  //creating token in hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        500
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password doesn't match", 500));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, 200, res);
});

//Get User Details or Profile
export const getUserDetails = catchAsyncFunc(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({ success: true, user });
});

//Get User Update password
export const updatePassword = catchAsyncFunc(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const ispasswordMatched = await bcrypt.compare(
    req.body.oldPassword,
    user.password
  );

  if (!ispasswordMatched) {
    return next(new ErrorHandler("OldPassword is inCorrect", 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password doesn't match", 400));
  }
  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 201, res);
});

//Update User profile
export const updateProfile = catchAsyncFunc(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

//get all users --admin

export const getAllUser = catchAsyncFunc(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

//get all single User --admin

export const singleUser = catchAsyncFunc(async (req, res, next) => {
  const users = await User.findById(req.params.id);
  if (!users) {
    return next(
      new ErrorHandler(`User doesn't exist with id : ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    users,
  });
});

//Update User Role -Admin
export const updateUserRole = catchAsyncFunc(async (req, res, next) => {
  const { name, email, role } = req.body;
  const newUserData = {
    name,
    email,
    role,
  };
 

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({ success: true });
});

//Delete User -Admin
export const deleteUser = catchAsyncFunc(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`user doesn't exist with id ${req.params.id}`, 400)
    );
  }
  const imageId = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(imageId);
  await user.deleteOne();

  res.status(200).json({ success: true, message: "User deleted successfully" });
});
