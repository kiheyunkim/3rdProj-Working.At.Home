import express from 'express';
import sequelize from './../../models/index';
import {checkBlackList, addBlackListCount} from '../../Security/BlackList';

const commonRouter = express.Router();

commonRouter.all('*',(request, response, next)=>{
    if(checkBlackList(request.socket.remoteAddress) == -1){
        response.status(404).send('IP가 차단되었습니다. 관리자에게 문의하세요');
        return;
    }
    if(request.session.remoteip === undefined){
        request.session.remoteip = request.socket.remoteAddress;
    }else{
        if(request.session.remoteip !== request.socket.remoteAddress){
            addBlackListCount(request.session.remoteip);
            request.logout();
            response.redirect('/login')
        }
    }
    next();
});

commonRouter.get('/',(request,response)=>{
    response.redirect('index.html');
})

commonRouter.get('/loginRequest',(request,response)=>{
    if(request.query.type === 'google'){
        response.redirect('/login/google');
    }else if(request.query.type === 'facebook'){
        response.redirect('/login/facebook');
    }else if(request.query.type === 'twitter'){
        response.redirect('/login/twitter');
    }else if(request.query.type === 'github'){
        response.redirect('/login/github');
    }else{
        response.redirect('error.html');
    }
});

commonRouter.get('/logout',(request,response)=>{
    if(request.session.passport !== undefined){
        response.redirect('/login/logout');
    }else{
        response.redirect('index.html');
    }
});

commonRouter.get('/passwordReset',(request,response)=>{
    let emailInput = '';
    let employee = '';
/*
    const transaction = await sequelize.transaction();
    try {
        
    } catch (error) {
        
    }*/

    //let find = await sequelize.models.user.count({email:emailInput});


    const find = sequelize.models.user.findOne({email:emailInput})
    //반복적인 시도를 막아야함
    
    //db조회 -> 비밀번호 초기화 됐는지?
})


export default commonRouter;