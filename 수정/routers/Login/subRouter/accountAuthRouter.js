import express from 'express';
import router from '../../RouterPath';

import {
    accountAuthFirewall,
    getJoinSocial,
    postJoinSocial,
    getAuthAccount,
    postAuthAccount,
    getquestion
} from "../../../controllers/accountAuthController";

let accountRouterPath = router.login.accountAuth;
const globalRouter = express.Router();

globalRouter.all(accountRouterPath.root, accountAuthFirewall);
globalRouter.get(accountRouterPath.socialJoin, getJoinSocial);
globalRouter.post(accountRouterPath.socialJoin, postJoinSocial);
globalRouter.get(accountRouterPath.accountAuth, getAuthAccount);
globalRouter.post(accountRouterPath.accountAuth, postAuthAccount);
globalRouter.get(accountRouterPath.question, getquestion);


export default globalRouter;