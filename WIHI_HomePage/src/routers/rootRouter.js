import express from "express";
import { about, home, manager, members } from "../controllers/rootController";
import { getJoin, getLogin, postJoin, postLogin } from "../controllers/userController";
import { publicOnlyMiddleware } from "../middlewares";



const rootRouter = express.Router();

rootRouter.get("/", home );



rootRouter.route("/login").all(publicOnlyMiddleware).get(getLogin).post(postLogin);
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter.route("/manager").get(manager)
rootRouter.route("/members").get(members)
rootRouter.route("/about").get(about)





export default rootRouter;