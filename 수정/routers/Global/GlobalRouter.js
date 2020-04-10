import express from 'express';
import router from '../RouterPath';
import {
  globalFirewall,
  firstHome,
  logout,
  githubCallback,
  googleCallback,
  facebookCallback,
  kakaoCallback,
  postCallback,
  getError
} from "./../../controllers/globalController";

let globalRouterPath = router.global;
const globalRouter = express.Router();

globalRouter.all(globalRouterPath.all, globalFirewall);
globalRouter.get(globalRouterPath.root,firstHome);
globalRouter.get(globalRouterPath.logout,logout);
globalRouter.get(globalRouterPath.passportCallback.github, githubCallback);
globalRouter.get(globalRouterPath.passportCallback.google, googleCallback);
globalRouter.get(globalRouterPath.passportCallback.facebook, facebookCallback);
globalRouter.get(globalRouterPath.passportCallback.kakao, kakaoCallback);
globalRouter.get(globalRouterPath.passportCallback.postCallBack, postCallback);
globalRouter.get(globalRouterPath.error, getError);


export default globalRouter;