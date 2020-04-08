import express from 'express';
import router from '../../RouterPath';

import {
    accountFirewall,
    getLogin,
    postLogin,
    getJoin,
    postJoin,
    getPasswordReset,
    postPasswordReset,
    githubLogin,
    googleLogin,
    facebookLogin
} from "./../../../controllers/accountController";

let accountRouterPath = router.login.account;
const globalRouter = express.Router();

globalRouter.all(accountRouterPath.root, accountFirewall);
globalRouter.get(accountRouterPath.login, getLogin);
globalRouter.post(accountRouterPath.login, postLogin);
globalRouter.get(accountRouterPath.join, getJoin);
globalRouter.post(accountRouterPath.join, postJoin);
//페이지 없음
globalRouter.get(accountRouterPath.reset, getPasswordReset)
globalRouter.post(accountRouterPath.reset, postPasswordReset)
//
globalRouter.get(accountRouterPath.social.github, githubLogin);
globalRouter.get(accountRouterPath.social.google, googleLogin);
globalRouter.get(accountRouterPath.social.facebook, facebookLogin);

export default globalRouter;