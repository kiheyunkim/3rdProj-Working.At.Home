import express from 'express';
import router from '../RouterPath';

import {
    loginFirewall
  } from '../../controllers/Login/loginController';

let loginRouterPath = router.login;
const loginRouter = express.Router();

loginRouter.all(loginRouterPath.all, loginFirewall);

export default loginRouter;