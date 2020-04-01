import express from 'express';
import {checkAdminAuth} from './../../Security/identifierGenerator';
const adminRouter = express.Router();

adminRouter.all('*',(request, response, next)=>{
    if(request.session.passport === undefined || !checkAdminAuth(request.session.auth)){
        response.send('/');
        return;
    }else{
        next();
    }
});


export default adminRouter;