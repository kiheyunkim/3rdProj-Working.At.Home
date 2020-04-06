import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

import { localsMiddleware } from "./middlewares";

import AddSession from './controllers/Sessions';
import addPassport from "./controllers/passport";
import addRouter from './routers/ExpressRouter';
import {setIdentifier} from './Security/identifierGenerator';
import sequelizeInit from './sequelizeInit';

console.log(global);

const app = express();

app.use(helmet());
app.set("view engine", "pug");
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("static"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("dev"));

setIdentifier();
AddSession(app);
addPassport(app);

app.use(localsMiddleware);  //!!!!!

addRouter(app);
(async ()=>{
  let startup = await sequelizeInit();
  if(!startup){
    console.error('구동 실패')
    process.exit(-1);
  }
})();

export default app;

//비번 423fef61