import express from 'express';
import router from '../RouterPath';

import {
    globalFirewall,
    firstHome,
    home,
    getJoin,
    postJoin
  } from "./../../controllers/globalController";

let globalRouterPath = router.global;
const globalRouter = express.Router();

globalRouter.all(globalRouterPath.root, globalFirewall);

globalRouter.get(globalRouterPath.first_home, firstHome);

globalRouter.get(globalRouterPath.join, getJoin);
globalRouter.post(globalRouterPath.join, postJoin);

export default globalRouter;