import express from 'express';
import router from '../RouterPath';

import {
  globalFirewall,
  firstHome,
  logout,
  passportCallBack
} from "./../../controllers/globalController";

let globalRouterPath = router.global;
const globalRouter = express.Router();

globalRouter.all(globalRouterPath.root, globalFirewall);
globalRouter.get(globalRouterPath.root,firstHome);
globalRouter.get(globalRouterPath.first_home, firstHome);
globalRouter.get(globalRouterPath.logout,logout);
globalRouter.get(globalRouterPath.passportCallback, passportCallBack);

export default globalRouter;