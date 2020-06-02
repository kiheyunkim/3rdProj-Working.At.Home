import express from "express";
import routes from "../routes";

import {
  showMe,
  getEditProfile,
  postEditProfile,
  getChangePassword,
  postChangePassword,
  userDetail
} from "../controllers/userController";

import { OnlyPublic, OnlyPrivate, uploadAvatar } from "../middlewares";

const userRouter = express.Router();

//사용자 프로필 영역
userRouter.get(routes.editProfile, OnlyPrivate, getEditProfile);
userRouter.post(routes.editProfile, OnlyPrivate, uploadAvatar, postEditProfile);

userRouter.get(routes.changePassword, OnlyPrivate, getChangePassword);
userRouter.post(routes.changePassword, OnlyPrivate, postChangePassword);

userRouter.get(routes.me, showMe);
userRouter.get(routes.userDetail(), OnlyPrivate, userDetail);

export default userRouter;
