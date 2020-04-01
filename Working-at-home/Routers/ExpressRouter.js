import adminRouter from "./router/AdminRouter";
import commonRouter from './router/CommonRouter';
import fileRouter from './router/fileRouter';
import loginRouter from './router/LoginRouter';
import videoRouter from "./router/VideoRouter";
import memberRouter from "./router/MemberRouter";
import fs from 'fs';

const routerInfo = JSON.parse(fs.readFileSync(__dirname +"/routerInfo.json",{encoding:"UTF-8"}));

export default (app)=>{
    app.use(routerInfo.video, adminRouter);
    app.use(routerInfo.commonRouter, commonRouter);
    app.use(routerInfo.fileRouter,fileRouter);
    app.use(routerInfo.loginRouter,loginRouter);
    app.use(routerInfo.member, videoRouter);
    app.use(routerInfo.admin, memberRouter);
}