import fs from 'fs';
import globalRouter from './Global/GlobalRouter';
import loginRouter from './Login/LoginRouter';
import accountRouter from './Login/subRouter/accountRouter';

let routerInfo = JSON.parse(fs.readFileSync(__dirname + '/routerInfo.json',{encoding:"UTF-8"}));

export default (app)=>{
    app.use(routerInfo.Global, globalRouter);
    app.use(routerInfo.Login, loginRouter);
    app.use(routerInfo.account, accountRouter)
    //app.use(routerInfo.User, userRouter);
    
    //app.use(routerInfo.Video, videoRouter);
}
