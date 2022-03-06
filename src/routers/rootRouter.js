import express from "express";
import { getJoin, postJoin, postLogin, getLogin } from "../controllers/userController";
import {home, search} from "../controllers/videoController";


const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/search", search);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(getLogin).post(postLogin);


export default rootRouter;