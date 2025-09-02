import { Task } from "../models/task";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import nodemailer from "nodemailer";
import { User } from "../models/user";

export const assignTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const { title, content, assignedBy, teacher } = req.body;

    const user = await User.findById(assignedBy);
    const teacherdata = await User.findById(teacher);

    if (title && content) {
      const task = await Task.create(req.body);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "app.torqnetwork@gmail.com",
          pass: "uxbm pxyz afii pfka",
        },
      });
  
      const options = {
        from: "app.torqnetwork@gmail.com",
        to: teacherdata?.email,
        subject: title,
  
        html: `
             <div styles={{padding:10; fontSize:20}}> ${user?.name} created a task for you!</div>
             <div styles={{padding:10; fontSize:20}}> Log in to you account for more details.</div>
            `,
      };
  
      let info = await transporter.sendMail(options);

      return res.status(201).json({
        success: true,
        message: "Task assigned successfully",
        data: task,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Title and content should not be empty",
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Some other error",
    });
  }
};

export const getAllTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tasks = await Task.find({}).populate("teacher");

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Some other error",
    });
  }
};

export const getAllTasksOfTeacher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tasks = await Task.find({ teacher: req.params.id }).populate(
      "teacher"
    );

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Some other error",
    });
  }
};

export const getTasksAssignedByMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tasks = await Task.find({ assignedBy: req.params.id }).populate(
      "teacher"
    );

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Some other error",
    });
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, content, status, teacher, deadline } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if(status == "completed"){
      const user = await User.findById(task?.assignedBy);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "app.torqnetwork@gmail.com",
          pass: "uxbm pxyz afii pfka",
        },
      });
  
      const options = {
        from: "app.torqnetwork@gmail.com",
        to: user?.email,
        subject: `${task?.title} -> Completed`,
  
        html: `
             <div styles={{padding:10; fontSize:20}}> ${user?.name} completed the given task.</div>
             <div styles={{padding:10; fontSize:20}}> Log in to you account for more details.</div>
            `,
      };
  
      let info = await transporter.sendMail(options);

      console.log("completed task mail")
      
    }

    task.title = title || task.title;
    task.content = content || task.content;
    task.status = status || task.status;
    task.deadline = deadline || task.deadline;
    task.teacher = teacher || task.teacher;

    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task Updated Successfully",
      data: task,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Some other error",
    });
  }
};

export const dellTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Some other error",
    });
  }
};

export const sendReminder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    // const task = await Task.findById(req.params.tid);

    // if (!task) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Task not found!",
    //   });
    // }

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
      subject: "Task Reminder -> HLA",

      html: `
      <div> Hello sir </div>
      <div> You have a task pending </div>
      <div> Please Complete it ASAP! </div>
      `,
    };

    let info = await transporter.sendMail(options);

    return res.status(201).json({
      success: true,
      message: "Check you email",
      info,
    });

    // return res.status(200).json({
    //   success: true,
    //   message: "Reminder sent successfully!",
    // });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Some other error",
    });
  }
};

const sendBulkMail = async() =>{
  // TODO: send mails
}

