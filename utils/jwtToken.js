
//create Token saving in cookie

const sendToken = (user, statuscode, res) => {
  const token = user.getJWTToken();

  //option for cookie
  const option = {
    httpOnly:true,
    maxAge:process.env.JWT_COOKIE_EXPIRE*24*60*60*1000,
    SameSite:process.env.NODE_ENV ==="Development"?"lax": "none",
    secure:process.env.NODE_ENV ==="Development"? false:true
  };
  res.status(statuscode).cookie("token",token,option).json({
    success: true,
    user,
    token
  })
};

export default sendToken
