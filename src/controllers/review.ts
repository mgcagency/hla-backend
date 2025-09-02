import { NextFunction, Request, Response } from "express";
import { Review } from "../models/review";
import { ScheduleClass } from "../models/schedule_classes";

export const createReview = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const {class_id, question} = req.body
        
        const review = await Review.create({
            class_id,
            question
        })

        const classname = await ScheduleClass.findByIdAndUpdate(class_id, {review_id: review._id}, {new:true})

        return res.status(201).json({
            success:true,
            message: "Review Created Successfully",
            data : {review, classname}
        })
    } 
    catch(error : any){
        return res.status(400).json({
            success:false,
            message: error.message || "Some issue with the server"
        })   
    }   
}

export const getReviews = async (req:Request, res: Response, next: NextFunction) => {
    try{
        const reviews = await Review.find();

        if(!reviews){
            return res.status(404).json({
                success:false,
                message: "No review found"
            })
        }

        return res.status(200).json({
            success:true,
            data: reviews
        })
    }
    catch (error: any){
        return res.status(400).json({
            success: false,
            message: error.message || "Some other error"
        })
    }
}

