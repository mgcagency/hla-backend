import jwt from "jsonwebtoken";

export const sendToken = (
  user: any,
  res: any,
  message: string,
  statusCode = 200,
  check: boolean
) => {
  let token;
  if (check) {
    token = jwt.sign({ _id: user._id }, "jwtsecret", {
      expiresIn: "1d",
    });

    res.status(statusCode).json({
      success: true,
      token,
      user,
      message,
    });
  } else {
    token = jwt.sign({ _id: user._id }, "jwtsecret", {
      expiresIn: "1d",
    });
    res.status(statusCode).json({
      success: true,
      token,
      user,
      message,
    });
  }
};
