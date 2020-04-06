import fs from 'fs';
import globalRouter from './Global/GlobalRouter';
import loginRouter from './Login/loginRouter';
import userRouter from './User/UserRouter';
import videoRouter from './Video/VideoRouter';

let routerInfo = JSON.parse(fs.readFileSync(__dirname + '/routerInfo.json',{encoding:"UTF-8"}));

export default (app)=>{
    app.use(routerInfo.Global, globalRouter);
    app.use(routerInfo.Login, loginRouter);
    app.use(routerInfo.User, userRouter);
    app.use(routerInfo.Video, videoRouter);
}
