import express from "express";
import routes from "../routes";

import {
  getUpload,
  postUpload,
  videoDetail,
  getEditVideo,
  postEditVideo,
  deleteVideo,
} from "../controllers/videoController";

import { uploadVideo, OnlyPublic, OnlyPrivate } from "../middlewares";

const videoRouter = express.Router();

//업로드
videoRouter.get(routes.upload, OnlyPrivate, getUpload);
videoRouter.post(routes.upload, OnlyPrivate, uploadVideo, postUpload);

//비디오 세부정보
videoRouter.get(routes.videoDetail(), OnlyPrivate, videoDetail);

//비디오 수정
videoRouter.get(routes.editVideo(), OnlyPrivate, getEditVideo);
videoRouter.post(routes.editVideo(), OnlyPrivate, postEditVideo);

//비디오 삭제
videoRouter.get(routes.deleteVideo(), OnlyPrivate, deleteVideo);

export default videoRouter;
