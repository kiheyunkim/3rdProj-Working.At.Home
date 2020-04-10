import express from 'express';
import router from '../RouterPath';

import {
    workingFirewall
  } from "../../controllers/workingController";

let workingRouterPath = router.working;
const workingRouter = express.Router();

workingRouter.all(workingRouterPath.all, workingFirewall);

export default workingRouter;