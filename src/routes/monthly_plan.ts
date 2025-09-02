import express from "express";
import { createMonthlyPlan, getAllMonthlyPlan, getMonthlyPlanHistory, sendReminderEmail, submitMonthlyPlan } from "../controllers/monthly_plan";

const app = express.Router();

app.post("/", createMonthlyPlan);
app.post("/submit/:id", submitMonthlyPlan);
app.post("/reminder", sendReminderEmail);
app.get("/history/user/:id", getMonthlyPlanHistory);
app.get("/", getAllMonthlyPlan);

export default app;
