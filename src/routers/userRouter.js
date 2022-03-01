import express from "express";
import {
  logout,
  see,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/:id", see);


export default userRouter;