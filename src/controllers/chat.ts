import { NextFunction, Request, Response } from "express";
import { Chats } from "../models/chat";

export const getChatHistory = async(req: Request, res: Response, next: NextFunction) => {
    const {userId1, userId2} = req.body

    try {
        // Query the database to get the chat history between these two users
        const chats = await Chats.find({
          members: { $all: [userId1, userId2] },
        });
    
        res.json({ messages: chats });
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
        res.status(500).json({ error: "Failed to fetch chat history" });
      }
}