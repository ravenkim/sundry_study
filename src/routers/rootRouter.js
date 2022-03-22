import express from "express";
import { home } from "../controllers/rootController";
import { getJoin, getLogin, postJoin, postLogin } from "../controllers/userController";



const rootRouter = express.Router();

rootRouter.get("/", home );
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.route("/join").get(getJoin).post(postJoin);




  

export default rootRouter;