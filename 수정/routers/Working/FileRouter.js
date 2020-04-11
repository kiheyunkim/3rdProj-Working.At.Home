import express from 'express';
import router from '../RouterPath';

import {
  fileFirewall,
  getFile
  } from "./../../controllers/FileController"

let workingRouterPath = router.working.file;
const workingRouter = express.Router();

workingRouter.all(workingRouterPath.all, fileFirewall);
workingRouter.get(workingRouterPath.fileget, getFile)

export default workingRouter;