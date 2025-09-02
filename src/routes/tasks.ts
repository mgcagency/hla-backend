import express from "express";
import { assignTask, dellTask, getAllTasks, getAllTasksOfTeacher, getTasksAssignedByMe, sendReminder, updateTask } from "../controllers/task";

const app = express.Router();

app.get("/", getAllTasks);
app.post("/", assignTask);
app.put("/:id", updateTask);
app.delete("/:id", dellTask);
app.post("/reminder", sendReminder);
app.get("/me/:id", getTasksAssignedByMe);

app.get("/teacher/:id", getAllTasksOfTeacher);

export default app;
