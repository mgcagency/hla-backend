import { NextFunction, Request, Response } from "express";
import { ScheduleClass } from "../models/schedule_classes";

// Create a new schedule class controller
export const createScheduleClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { teacher_id, student_id, review_id, title, startTime, endTime, status, repeat, weekDays, location } = req.body;

        const newClass = await ScheduleClass.create({
            teacher_id,
            student_id,
            review_id,
            title,
            startTime,
            endTime,
            status,
            repeat,
            weekDays,
            location
        });

        await newClass.populate("teacher_id");
        await newClass.populate("student_id");

        return res.status(201).json({
            success: true,
            message: "Class scheduled successfully",
            data: newClass
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error || "An error occurred while scheduling the class",
        });
    }
};

export const getAllClasses = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const classes = await ScheduleClass.find()
        .populate('teacher_id') 
        .populate('student_id')
        .populate('review_id');

        // let finalData: { class: IScheduleClass | {}, review:IReview | {} , status: boolean}[] = [];
    
        //     await Promise.all (classes.map( async (item) =>{
        //         let sendingOBj = {
        //             review: {},
        //             class: {},
        //             status: false
        //         }
        //         if(item.status == "Completed"){
        //             const rev = await Review.find({class_id: item._id})
        //             if(!rev){
        //                 sendingOBj.review = {};
        //                 sendingOBj.status = false;
        //             }else{
        //                 sendingOBj.status = true;   
        //                 sendingOBj.review = rev;
        //                 sendingOBj.class = item;
        //             }
        //             console.log(sendingOBj)
        //             finalData.push(sendingOBj);
        //         }else{
        //             sendingOBj.class = item;
        //             finalData.push(sendingOBj);
        //         }
        //     }))

        return res.status(200).json({
            success: true, 
            data: classes
        })
    }
    catch (error) {
        return res.json(400).json({
            success: false,
            message: error
        })
    }
}

export const editClassById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { teacher_id, student_id, review_id, title, startTime, endTime, status, repeat, weekDays, location } = req.body;

        const scheduleClass = await ScheduleClass.findById(id);

        if (!scheduleClass) {
            return res.status(404).json({
                success: false,
                message: "Class not found",
            });
        }

        scheduleClass.teacher_id = teacher_id || scheduleClass.teacher_id;
        scheduleClass.student_id = student_id || scheduleClass.student_id;
        scheduleClass.review_id = review_id || scheduleClass.review_id;
        scheduleClass.title = title || scheduleClass.title;
        scheduleClass.startTime = startTime || scheduleClass.startTime;
        scheduleClass.endTime = endTime || scheduleClass.endTime;
        scheduleClass.status = status || scheduleClass.status;
        scheduleClass.repeat = repeat !== undefined ? repeat : scheduleClass.repeat;
        scheduleClass.weekDays = weekDays || scheduleClass.weekDays;
        scheduleClass.location = location || scheduleClass.location;

        await scheduleClass.save();

        return res.status(200).json({
            success: true,
            message: "Class updated successfully",
            data: scheduleClass
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message || "An error occurred while updating the class",
        });
    }
};

export const deleteClassById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const scheduleClass = await ScheduleClass.findByIdAndDelete(id);

        if (!scheduleClass) {
            return res.status(404).json({
                success: false,
                message: "Class not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Class deleted successfully",
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message || "An error occurred while deleting the class",
        });
    }
};

export const getStudentReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { sid } = req.params;

        const scheduleClass = await ScheduleClass.find({status: "finished", student_id: sid.toString()});

        return res.status(200).json({
            success: true,
            classes: scheduleClass,
            message: "data",
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message || "An error occurred while deleting the class",
        });
    }
};