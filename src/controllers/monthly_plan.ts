import { MonthlyPlan } from "../models/monthly_plan";
import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import nodemailer from "nodemailer";
import mongoose from "mongoose";

export const createMonthlyPlan = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { docLink } = req.body;

    const allTeachers = await User.find({ role: "teacher" });
    let allIds: any = [];
    let obj: any = {};

    allTeachers.forEach((item) => {
      obj.user = item._id;
      obj.isLate = false;
      obj.submitted = false;
      obj.fileUrl = "";

      allIds.push(obj);
      obj = {};
    });

    const monthlyPlan = await MonthlyPlan.create({
      docLink,
      submissions: allIds,
    });

    return res.status(201).json({
      success: true,
      message: "Monthly Plan Created Successfully!",
      data: monthlyPlan,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Some issue with the server",
    });
  }
};

export const getAllMonthlyPlan = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const monthlyPlans = await MonthlyPlan.find({}).populate(
      "submissions.user"
    );

    return res.status(201).json({
      success: true,
      data: monthlyPlans,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Some issue with the server",
    });
  }
};

export const submitMonthlyPlan = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user, fileUrl } = req.body;
    const { id } = req.params;

    const monthlyPlans = await MonthlyPlan.findOneAndUpdate(
      { _id: id, "submissions.user": user },
      {
        $set: {
          "submissions.$[elem].submitted": true,
          "submissions.$[elem].submittedAt": new Date(),
          "submissions.$[elem].fileUrl": fileUrl,
        },
      },
      {
        arrayFilters: [{ "elem.user": user }],
        new: true,
      }
    );

    return res.status(201).json({
      success: true,
      data: monthlyPlans,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Some issue with the server",
    });
  }
};



export const getMonthlyPlanHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    let userId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id);

    const wellnesses = await MonthlyPlan.aggregate([
      { $match: { "submissions.user": userId } },
      {
        $project: {
          month:1,
          docLink: 1,
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
        service: 'gmail',
        auth: {
            user: "app.torqnetwork@gmail.com",
            pass: "uxbm pxyz afii pfka"
        }
    });

    const options = {
        from: "app.torqnetwork@gmail.com",
        to: email,
        subject: "Hello from HLA",

        html: ` <div styles={{padding:20; fontSize:20}}> Please check you monthly form and fill it  </div> `,
    };

    let info = await transporter.sendMail(options);

    return res.status(201).json({
        success: true,
        message: "Check you email",
        info
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Some issue with the server",
    });
  }
};
