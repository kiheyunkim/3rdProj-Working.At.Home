import express from 'express';
import router from '../../RouterPath';

import {
  videoFireWall,
  getVideoHome,
  getUpload,
  postUpload,
  videoDetail,
  getEditVideo,
  postEditVideo,
  deleteVideo,
  search
  } from "../../../controllers/videoController";

let VideoRouterPath = router.working.video;
const videoRouter = express.Router();

videoRouter.all(VideoRouterPath.all, videoFireWall);
videoRouter.get(VideoRouterPath.root, getVideoHome)
videoRouter.get(VideoRouterPath.upload, getUpload);
videoRouter.post(VideoRouterPath.upload, postUpload);
videoRouter.post(VideoRouterPath.detail, videoDetail);
videoRouter.get(VideoRouterPath.edit, getEditVideo);
videoRouter.post(VideoRouterPath.edit, postEditVideo);
videoRouter.get(VideoRouterPath.delete,deleteVideo);
videoRouter.get(VideoRouterPath.search, search);

export default videoRouter;