import express from "express";
import { getChatHistory } from "../controllers/chat";

const app = express.Router();

app.get("chat-history", getChatHistory)

export default app;