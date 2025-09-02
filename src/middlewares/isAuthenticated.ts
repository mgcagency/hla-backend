import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

// export const isAuthenticated = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   console.log(" req data is : ", req.user);
//   console.log(" req data is auth : ", req.isAuthenticated());
//   console.log(" req data is no auth : ", req.isUnauthenticated());
//   if (req.isAuthenticated()) {
//     next();
//   } else {
//     return res.status(401).send({
//       message: "Unauthorized",
//     });
//   }
// };

export const isAuthenticated = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send({
      message: "Unauthorized",
    });
  }

  try {
    const decodedData = jwt.verify(token, "jwtsecret") as any;
    req.user = await User.findById(decodedData?._id);
    next();
  } catch (error: any) {
    if (error.message == "jwt expired") {
      return res.status(401).send({
        message: "Session is expired",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
