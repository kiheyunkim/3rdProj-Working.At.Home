import express from 'express';
import {checkUserAuth} from './../../Security/identifierGenerator';

const memberRouter = express.Router();

memberRouter.get('*',(request, response, next)=>{
    if(request.isUnauthenticated() || !checkUserAuth(request.session.auth)){
        return;
    }else{
        next();
    }
});

memberRouter.all('/main',(request, response)=>{
    response.render('user/employee.html');
});

export default memberRouter;