import express from "express";
import { createReview, getReviews } from "../controllers/review";


const app = express.Router();

app.post("/createReview", createReview);
app.get("/viewReviews",getReviews);

export default app;