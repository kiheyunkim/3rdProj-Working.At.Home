import express from 'express';
import router from '../../../RouterPath';

import {
    accountAuthLocalFirewall,
    getAuthAccount,
    postAuthAccount
} from "./../../../../controllers/Login/localAuthController";

let localAuthRouterPath = router.login.accountAuth.local;
const localAuthRouter = express.Router();

localAuthRouter.all(localAuthRouterPath.all, accountAuthLocalFirewall);//완성
localAuthRouter.get(localAuthRouterPath.accountAuth, getAuthAccount);//완성
localAuthRouter.post(localAuthRouterPath.accountAuth, postAuthAccount);

export default localAuthRouter;