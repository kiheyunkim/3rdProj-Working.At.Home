import express from 'express';
import router from '../RouterPath';

import {
    loginFirewall,
    getLogin,
    postLogin,
    githubLogin,
    googleLogin,
    facebookLogin,
    passportCallBack,
    logout
  } from "../../controllers/loginController";

let LoginRouterPath = router.login;
const videoRouter = express.Router();

//videoRouter.all(LoginRouterPath.root, loginFirewall);


export default videoRouter;