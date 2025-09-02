import nodemailer from "nodemailer";
import VerficationCode from "../models/verificationCode";

import { User } from "../models/user";
import { sendToken } from "../utils/features";
import { NextFunction, Request, Response } from "express";
import { ScheduleClass } from "../models/schedule_classes";
import { compare, compareSync, hash, hashSync } from "bcryptjs";

//  -----------CREATE A USER----------
export const newUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      email,
      photo,
      role,
      phoneNo,
      password,
      teacher,
      registeredChildren,
    } = req.body;
    //   console.log(name, email, teacher);

    if (role == "admin") {
      delete req.body.role;
    }

    const hashPassword = await hash(password, 10);

    const user = await User.create({
      name,
      email,
      photo,
      role,
      teacher,
      phoneNo,
      password: hashPassword,
      registeredChildren: role === "parent" ? registeredChildren : undefined,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "app.torqnetwork@gmail.com",
        pass: "uxbm pxyz afii pfka",
      },
    });

    const options = {
      from: "app.torqnetwork@gmail.com",
      to: email,
      subject: "Account Credentials!",

      html: `
           <div styles={{padding:10; fontSize:20}}> A ${role} account have been created with you email.</div> 
           <div styles={{padding:10; fontSize:20}}> Account Credentials </div> 
           <div styles={{padding:10; fontSize:20}}> username: ${email} </div> 
           <div styles={{padding:10; fontSize:20}}> password: ${password} </div>
           <div styles={{padding:10; fontSize:20}}> You can login with on the following url </div>
           <a href="https://hla-frontend.vercel.app" > https://hla-frontend.vercel.app </a>
          `,
    };

    let info = await transporter.sendMail(options);

    sendToken(user, res, `Welcome, ${user.name}`, 200, false);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }
};

//   -----------LOGIN USER----------
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email })
    .select("+password")
    .populate("registeredChildren").populate("teacher");
  if (!user) {
    return res.status(404).json({
      success: false,
      message: `User Not Found`,
    });
  }

  const isMatch = await compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: `Invalid Password`,
    });
  }
  sendToken(user, res, `Welcome, ${user.name}`, 200, false);
};

//  -----------VIEW ALL USERS----------
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).populate(
      "registeredChildren"
    );
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }
};

//  -----------EDIT A USER----------
export const editUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, phoneNo, photo, registeredChildren, isOnline } =
      req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phoneNo = phoneNo || user.phoneNo;
    user.photo = photo || user.photo;
    user.isOnline = isOnline !== undefined ? isOnline : user.isOnline;
    user.registeredChildren = registeredChildren || user.registeredChildren;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "An error occurred while updating the user",
    });
  }
};

// -----------DELETE A USER----------
export const deleteUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "An error occurred while deleting the user",
    });
  }
};

// -----------GET ALL STUDENTS----------

export const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const students = await User.find({ role: "student" });
    return res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }
};

// -----------GET ALL TEACHERS----------
export const getAllTeachers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const teachers = await User.find({ role: "teacher" });
    const classes = await ScheduleClass.find();

    return res.status(200).json({
      success: true,
      data: teachers,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }
};

export const sendVerificationCodeByEamil = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  const user = await VerficationCode.findOne({ email });
  if (user) {
    await user.deleteOne();
  }

  const verificationCode = Math.floor(10000 + Math.random() * 90000);
  const codeStr = verificationCode.toString();
  const hashcode = hashSync(codeStr, Number(10));

  const verifyCode = await VerficationCode.create({
    email,
    code: hashcode,
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "app.torqnetwork@gmail.com",
      pass: "uxbm pxyz afii pfka",
    },
  });

  const options = {
    from: "app.torqnetwork@gmail.com",
    to: email,
    subject: "Hello from HLA",

    html: `
    <div> Your One time login Verification code is : ${codeStr} </div>
    `,
  };

  let info = await transporter.sendMail(options);

  return res.status(201).json({
    success: true,
    message: "Code sent successfully! Check you email",
    info,
  });
};

export const verifyVerificationCodeByEamil = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, code } = req.body;

  const user = await VerficationCode.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const isvalid = await compareSync(code, user.code!);

  if (!isvalid) {
    return res.status(400).json({
      success: false,
      message: "Code invalid or expired!",
    });
  }

  await user.deleteOne();

  return res.status(201).json({
    success: true,
    message: "Code verified successfully!",
  });
};
