import express from 'express';
import router from '../../../RouterPath';

import {
    accountAuthSnsFirewall,
    getJoinSocial,
    postJoinSocial
} from "../../../../controllers/snsAuthController";

let snsAuthRouterPath = router.login.accountAuth.sns;
const snsAuthRouter = express.Router();

snsAuthRouter.all(snsAuthRouterPath.all, accountAuthSnsFirewall);//완성
snsAuthRouter.get(snsAuthRouterPath.socialJoin, getJoinSocial);
snsAuthRouter.post(snsAuthRouterPath.socialJoin, postJoinSocial);

export default snsAuthRouter;