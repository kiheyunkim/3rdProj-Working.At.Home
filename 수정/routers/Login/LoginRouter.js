import express from 'express';
import router from '../RouterPath';

import {
    loginFirewall,
    passportCallBack
  } from '../../controllers/loginController';

let loginRouterPath = router.login;
const loginRouter = express.Router();

loginRouter.all(loginRouterPath.root, loginFirewall);
loginRouter.get(loginRouterPath.passportCallback, passportCallBack);

export default loginRouter;