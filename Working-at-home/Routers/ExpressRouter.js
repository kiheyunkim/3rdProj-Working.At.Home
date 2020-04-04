import adminRouter from "./router/AdminRouter";
import commonRouter from './router/CommonRouter';
import fileRouter from './router/fileRouter';
import loginRouter from './router/LoginRouter';
import memberRouter from "./router/MemberRouter";
import videoRouter from "./router/VideoRouter";
import {errorRouter} from './router/ErrorRouter';

import express from 'express';
import fs from 'fs';

const routerInfo = JSON.parse(fs.readFileSync(__dirname +"/routerInfo.json",{encoding:"UTF-8"}));

export default (app)=>{
    app.use(express.static(__dirname + '/../public'));
    app.use(routerInfo.adminRouter, adminRouter);
    app.use(routerInfo.commonRouter, commonRouter);
    app.use(routerInfo.fileRouter,fileRouter);
    app.use(routerInfo.loginRouter,loginRouter);
    app.use(routerInfo.memberRouter, memberRouter);
    app.use(routerInfo.videoRouter, videoRouter);
    app.use(errorRouter);
}