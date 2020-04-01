import express from 'express';
import {checkUserAuth} from './../../Security/identifierGenerator';

const memberRouter = express.Router();

memberRouter.get('*',(request, response, next)=>{
    if(request.session.passport === undefined || !checkUserAuth(request.session.auth)){
        response.send('/');
        return;
    }else{
        next();
    }
});


export default memberRouter;