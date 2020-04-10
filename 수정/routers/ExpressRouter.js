import fs from 'fs';
import globalRouter from './Global/GlobalRouter';
import loginRouter from './Login/LoginRouter';
import accountRouter from './Login/subRouter/accountRouter';
import accountAuthRouter from './Login/subRouter/accountAuthRouter';
import accountAuthSnsRouter from './Login/subRouter/accountAuthSubRouter/snsAuthRouter';
import accountAuthLocalRouter from './Login/subRouter/accountAuthSubRouter/localAuthRouter';
import workingRouter from './Working/WorkingRouter';
import userRouter from './Working/subRouter/UserRouter';
import videoRouter from './Working/subRouter/VideoRouter';
let routerInfo = JSON.parse(fs.readFileSync(__dirname + '/routerInfo.json',{encoding:"UTF-8"}));

export default (app)=>{
    app.use(routerInfo.Global, globalRouter);
    app.use(routerInfo.Login, loginRouter);
    app.use(routerInfo.account, accountRouter);
    app.use(routerInfo.accountAuth,accountAuthRouter);
    app.use(routerInfo.accountAuthsns,accountAuthSnsRouter);
    app.use(routerInfo.accountAuthlocal,accountAuthLocalRouter);
    app.use(routerInfo.working, workingRouter)
    app.use(routerInfo.video, videoRouter);
    app.use(routerInfo.user, userRouter);
}
