import express from "express";
import {  deleteUserById, editUserById, getAllStudents, getAllTeachers, getAllUsers, loginUser, newUser, sendVerificationCodeByEamil, verifyVerificationCodeByEamil } from "../controllers/user";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { verify } from "crypto";

const app = express.Router();

// route = /api/user/...

app.post("/new", newUser);

app.post("/login", loginUser);
app.post("/send/code", sendVerificationCodeByEamil);
app.post("/verify/code", verifyVerificationCodeByEamil);

app.use(isAuthenticated);
app.get("/viewAllUsers", isAuthenticated, getAllUsers)
app.put("/editUserDetails/:id",editUserById);

app.delete("/deleteUser/:id", deleteUserById);


// Student Routes
app.get("/viewAllStudents" , getAllStudents);

// Teacher Routes
app.get("/viewAllTeachers" , getAllTeachers);



export default app;