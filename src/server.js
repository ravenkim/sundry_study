import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from 'connect-mongo'

import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";



const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));


app.use("/", rootRouter);
app.use("/static", express.static("assets"));



export default app;