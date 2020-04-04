import express from 'express';

import addRouter from './Routers/ExpressRouter';
import addSession from './Controllers/Session';
import addPassport from './Controllers/Passport';
import sequelizeInit from './sequelizeInit';
import {setIdentifier} from './Security/identifierGenerator';


import expressThymeleaf from 'express-thymeleaf';
import {TemplateEngine, STANDARD_CONFIGURATION} from 'thymeleaf';
 
let templateEngine = new TemplateEngine(STANDARD_CONFIGURATION);

const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());


//setSecurity
setIdentifier();
//세션 설정 
addSession(app);
//passPort 설정
addPassport(app);
//라우터 설정 -- 세션이 선행되어야함
addRouter(app);
//sequelize
if(!sequelizeInit()){   
    console.error('구동 실패')
    process.exit(-1);
}

app.engine('html',expressThymeleaf(templateEngine));
app.set('view engine','html');

app.listen(4000,()=>{
    console.log("Listen 4000 port");
})