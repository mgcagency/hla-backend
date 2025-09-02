import express from "express";
import { createWellness, getAllWellness, getWellnessHistory, sendReminderEmail, submitWellness } from "../controllers/wellness";

const app = express.Router();

app.post("/", createWellness);
app.post("/submit/:id", submitWellness);
app.post("/reminder", sendReminderEmail);
app.get("/history/user/:id", getWellnessHistory);
app.get("/", getAllWellness);

export default app;
