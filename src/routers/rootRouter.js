import express from "express";
import { home } from "../controllers/rootController";
import { getLogin } from "../controllers/userController";


const rootRouter = express.Router();

rootRouter.get("/", home );
rootRouter.route("/login").get(getLogin)



  

export default rootRouter;