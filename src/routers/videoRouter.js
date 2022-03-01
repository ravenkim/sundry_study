import express from "express";
import { deleteVideo, watch } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)", watch);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);


export default videoRouter;