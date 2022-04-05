import express from "express";
import { deleteVideo, getUpload, postUpload, videos, watch } from "../controllers/videoController";
import { protectorMiddleware, videoUpload } from "../middlewares";

const videoRouter = express.Router();




videoRouter.get("/", videos);

videoRouter.get("/:id([0-9a-f]{24})", watch);

videoRouter.route("/upload").all(protectorMiddleware)
  .get(getUpload)
  .post(videoUpload.fields([{ name: "video" }, { name: "thumb" }]), postUpload);

videoRouter.route("/:id([0-9a-f]{24})/delete").all(protectorMiddleware).get(deleteVideo);

export default videoRouter;




