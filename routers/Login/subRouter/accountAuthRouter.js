import express from 'express';
import router from '../../RouterPath';

import {
    accountAuthFirewall
} from "./../../../controllers/Login/accountAuthController";

let accountRouterPath = router.login.accountAuth;
const accountRouter = express.Router();

accountRouter.all(accountRouterPath.all,accountAuthFirewall);//완료

export default accountRouter;