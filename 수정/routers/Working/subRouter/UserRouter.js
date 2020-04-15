import express from 'express';
import router from '../../RouterPath';
import multer from 'multer';
const multerAvatar = multer({ dest: "uploads/avatar/" });
const uploadAvatar = multerAvatar.single("avatar");

import {
    userFirewall,
    showMe,
    getEditProfile,
    postEditProfile
  } from "../../../controllers/userController";

let userRouterPath = router.working.user;
const userRouter = express.Router();
  
userRouter.all(userRouterPath.root, userFirewall);
userRouter.get(userRouterPath.me, showMe);

userRouter.get(userRouterPath.edit, getEditProfile);
userRouter.post(userRouterPath.edit, uploadAvatar, postEditProfile);

export default userRouter;