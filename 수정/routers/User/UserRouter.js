import express from 'express';
import router from '../RouterPath';

import {
    userFirewall,
    home,
    showMe,
    getEditProfile,
    postEditProfile,
    getChangePassword,
    postChangePassword,
    userDetail
  } from "../../controllers/userController";

let userRouterPath = router.user;
const userRouter = express.Router();

userRouter.all(userRouterPath.root, userFirewall);

userRouter.get(userRouterPath.root, home);

userRouter.get(userRouterPath.editProfile, getEditProfile);
userRouter.post(userRouterPath.editProfile,/* uploadAvatar,*/ postEditProfile); // 수정?

userRouter.get(userRouterPath.changePassword, getChangePassword);
userRouter.post(userRouterPath.changePassword, postChangePassword);

userRouter.get(userRouterPath.me, showMe);
userRouter.get(userRouterPath.userDetail(), userDetail);

export default userRouter;