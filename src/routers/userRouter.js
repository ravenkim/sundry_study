import express from "express";
import {
  finishGithubLogin,
  logout,
  see,
  startGithubLogin,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/:id", see);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);



export default userRouter;