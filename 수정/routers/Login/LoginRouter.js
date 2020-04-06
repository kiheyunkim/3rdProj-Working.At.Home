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
  } from './../../controllers/loginController';

let loginRouterPath = router.login;
const loginRouter = express.Router();

loginRouter.all(loginRouterPath.root, loginFirewall);

loginRouter.get(loginRouterPath.local.login, getLogin);
loginRouter.post(loginRouterPath.local.login, postLogin);

loginRouter.get(loginRouterPath.github.github_login, githubLogin);
loginRouter.get(loginRouterPath.google.google_login, googleLogin);
loginRouter.get(loginRouterPath.facebook.facebook_login, facebookLogin);

loginRouter.get(loginRouterPath.github.github_callback, passportCallBack);
loginRouter.get(loginRouterPath.google.google_callback, passportCallBack);
loginRouter.get(loginRouterPath.facebook.facebook_callback, passportCallBack);

loginRouter.get(loginRouterPath.logout, logout);

export default loginRouter;