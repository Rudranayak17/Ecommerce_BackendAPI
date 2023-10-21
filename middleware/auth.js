import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorhandler.js";
import User from "../model/user.js";
import { catchAsyncFunc } from "./catchAsyncErrors.js";
const isAuthenticated = catchAsyncFunc(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("plz login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
 req.user= await User.findById(decodedData.id)

 next()
});


export const authorizeRoles=(...roles)=>{

return(req,res,next)=>{
    if (!roles.includes(req.user.role)) {
       return next( new ErrorHandler(`Role : ${req.user.role} is not authorized to access this resource`,403))
    }
    next();
}

}



export default isAuthenticated;
