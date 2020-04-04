import express from 'express';
import {checkAdminAuth} from './../../Security/identifierGenerator';
import {addBlackListCount} from '../../Security/BlackList';
const adminRouter = express.Router();

adminRouter.all('*',(request, response, next)=>{
    if(request.isAuthenticated() && checkAdminAuth(request.session.auth)){
        console.log('pass');
        next();
    }else{
        addBlackListCount(request.socket.remoteAddress);
        console.log('nope');
        response.redirect("/");
    }
});

adminRouter.all('/main',(request, response)=>{
    response.render('admin/admin.html');
});


export default adminRouter;