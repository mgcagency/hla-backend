import {Request, Response, NextFunction} from "express"
import { Wellbeing } from "../models/wellbeing"

export const newWellbeing = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const {title, content, link} = req.body;

        const wellbeing = await Wellbeing.create({
            title, 
            content,
            link
        });

        return res.status(201).json({
            success: true, 
            message: "Wellbeing successfully created",
            data: wellbeing
        })
    }
    catch(error: any){
        return res.status(400).json({
            success: false,
            message: error.message || "Some other error"
        })
    }
}

export const getWellbeings = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const wellbeings = await Wellbeing.find();

        if(!wellbeings) {
            return res.json(404).json({
                success: true,
                message: "No Wellbeings Listed"
            })
        }

        return res.status(200).json({
            success: true,
            data: wellbeings
        })

    }
    catch(error: any){
        return res.status(400).json({
            success: false,
            message: error.message || "Some other error"
        })
    }
}

export const editWellbeing = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const {title, content, link} = req.body
        const wellbeing = await Wellbeing.findById(req.params.id);

        if(!wellbeing){
            return res.status(404).json({
                success: false,
                message: "Wellbeing not found",
            });
        }

        wellbeing.title = title || wellbeing.title;
        wellbeing.content = content || wellbeing.content;
        wellbeing.link = link || wellbeing.link;

        await wellbeing.save();

        return res.status(200).json({
            success: true,
            message: "Wellbeing Updated Successfully",
            data: wellbeing,
        })
    }
    catch(error: any){
        return res.status(400).json({
            success: false,
            message: error.message || "Some other error"
        })
    }
}

export const deleteWellbeingById = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const wellbeing = await Wellbeing.findByIdAndDelete(req.params.id);

        if(!wellbeing){
            return res.status(404).json({
                success: false,
                message: "Wellbeing not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Wellbeing deleted successfully",
        });

    }
    catch(error: any){
        return res.status(400).json({
            success: false,
            message: error.message || "Some other error"
        })
    }
}