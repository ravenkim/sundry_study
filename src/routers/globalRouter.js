import express from "express";
import {home, search} from "../controllers/videoController";


const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/search", search);

export default globalRouter;