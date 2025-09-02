import express, { NextFunction, Request, Response } from "express";
import { createScheduleClass, deleteClassById, editClassById, getAllClasses, getStudentReport } from "../controllers/schedule_class";

const app = express.Router();

app.post("/scheduleClass", createScheduleClass);
app.get("/viewAllClasses", getAllClasses );
app.get("/report/:sid", getStudentReport );
app.put("/editClassDetails/:id", editClassById );
app.delete("/deleteClass/:id", deleteClassById);


export default app;