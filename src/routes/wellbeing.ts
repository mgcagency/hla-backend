import express from "express";
import { deleteWellbeingById, editWellbeing, getWellbeings, newWellbeing } from "../controllers/wellbeing";

const app = express.Router();

app.post("/createWellbeing", newWellbeing);
app.get("/viewWellbeing", getWellbeings);
app.put("/editWellbeing/:id", editWellbeing)
app.delete("/deleteWellbeing/:id", deleteWellbeingById)

export default app