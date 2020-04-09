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
const accountRouter = express.Router();

accountRouter.all(accountRouterPath.all, accountFirewall);//완성
accountRouter.get(accountRouterPath.login, getLogin);//완성
accountRouter.post(accountRouterPath.login, postLogin);//완성
accountRouter.get(accountRouterPath.join, getJoin);//완성
accountRouter.post(accountRouterPath.join, postJoin);//완성
accountRouter.get(accountRouterPath.reset, getPasswordReset)//완성
accountRouter.post(accountRouterPath.reset, postPasswordReset)//완성
accountRouter.get(accountRouterPath.social.github, githubLogin);//완성
accountRouter.get(accountRouterPath.social.google, googleLogin);//완성
accountRouter.get(accountRouterPath.social.facebook, facebookLogin);//완성

export default accountRouter;