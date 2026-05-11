import express from "express";
import { logout } from "../controllers/userController";
import { protectorMiddleware } from "../middlewares";

const userRouter = express.Router();


userRouter.get("/logout", protectorMiddleware ,logout);


export default userRouter;
