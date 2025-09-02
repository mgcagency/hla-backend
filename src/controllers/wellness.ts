import nodemailer from "nodemailer";

import { User } from "../models/user";
import { Wellness } from "../models/wellness";
import { NextFunction, Request, Response } from "express";
import mongoose, { mongo } from "mongoose";

export const createWellness = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { formLink } = req.body;

    const allTeachers = await User.find({ role: "teacher" });

    let allIds: any = [];
    let obj: any = {};

    allTeachers.forEach((item) => {
      obj.user = item._id;
      obj.isLate = false;
      obj.submitted = false;

      allIds.push(obj);
      obj = {};
    });

    let currentMonth = new Date().getMonth();

    const shortMonthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    
    const monthName = shortMonthNames[currentMonth];

    const wellness = await Wellness.create({ formLink, month: monthName, submissions: allIds });

    return res.status(201).json({
      success: true,
      message: "Wellness form Created Successfully",
      data: wellness,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Some issue with the server",
    });
  }
};

export const getAllWellness = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const wellnesses = await Wellness.find({}).populate("submissions.user");
    return res.status(201).json({
      success: true,
      data: wellnesses,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Some issue with the server",
    });
  }
};

export const submitWellness = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const { user, fileUrl } = req.body;

    const wellnesses = await Wellness.findOneAndUpdate(
      { _id: id, "submissions.user": user },
      {
        $set: {
          "submissions.$[elem].submitted": true,
          "submissions.$[elem].submissionAt": new Date(),
        },
      },
      {
        arrayFilters: [{ "elem.user": user }],
      }
    );

    return res.status(201).json({
      success: true,
      data: wellnesses,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Some issue with the server",
    });
  }
};

export const getWellnessHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    let userId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id);

    const wellnesses = await Wellness.aggregate([
      { $match: { "submissions.user": userId } },
      {
        $project: {
          month:1,
          formLink: 1,
          submissions: {
            $filter: {
              input: "$submissions",
              as: "submission",
              cond: { $eq: ["$$submission.user", userId] },
            },
          },
        },
      },
    ]);

    return res.status(201).json({
      success: true,
      data: wellnesses,
    });
  } catch (error: any) {
    console.log(" error is : ", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Some issue with the server",
    });
  }
};

export const sendReminderEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

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

      html: ` <div> Please check you monthly form and fill it  </div> `,   
    };

    let info = await transporter.sendMail(options);

    return res.status(201).json({
      success: true,
      message: "Check you email",
      info,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Some issue with the server",
    });
  }
};
