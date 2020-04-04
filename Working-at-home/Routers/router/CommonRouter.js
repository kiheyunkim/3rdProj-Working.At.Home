import express, { response, request } from 'express';
import sha256 from 'sha256';

import sequelize from './../../models/index';
import {Emailsend} from './../../Controllers/MailSend';
import {checkUserAuth, checkAdminAuth} from '../../Security/identifierGenerator';
import RandomStringGenerator from './../../Security/RandomStringGenerator';
import {checkBlackList, addBlackListCount} from '../../Security/BlackList';
import {ResultMessage} from '../../Message/MessageGenerator';

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
            console.log(request.socket.remoteAddress);
            addBlackListCount(request.session.remoteip);
            request.logout();
            response.render('index.html');
            return;
        }
    }  
    next();
});

commonRouter.get('/',(request,response)=>{
    response.render('index.html');
})

commonRouter.get('/index.html',(request,response,next)=>{
    if(request.isAuthenticated()){
        if(checkUserAuth(request.session.auth)){
            //response.render('/employee.html');
        }else if(checkAdminAuth(request.session.auth)){
            response.redirect('/admin/main');
        }else{
            response.render('/error.html');
        }
    }else{
        next();
    } 
});

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
        response.render('error.html');
    }
});

commonRouter.get('/logout',(request,response)=>{
    if(request.isAuthenticated()){
        response.redirect('/login/logout');
    }else{
        response.render('index.html');
    }
});

commonRouter.get('/pwResetRequest',(request,response)=>{
    response.render('resetreq.html');
});

commonRouter.get('/signupRequest',(request,response)=>{
    response.render('signupSelect.html');
})


commonRouter.post('/passwordReset',async (request,response)=>{
    if(request.isAuthenticated()){
        response.render('info.html',{message:'로그인 된 사용자는 내부 메뉴를 이용해주세요',canGoBack:fasle});
        return;
    }

    if(request.session.lastReset === undefined){
        request.session.lastReset = new Date();
        request.session.resetCount = 0;
    }

    request.session.resetCount++;

    if(request.session.resetCount > 5){
        let currentDate = new Date();
        if(currentDate.getTime() - request.session.lastReset < 30 * 60 * 1000){
            response.render('info.html',{message:'30분 뒤에 다시 시도해주세요',canGoBack:false});
            return;
        }else{
            request.session.resetCount = 0;
            request.session.lastReset = new Date();
        }
    }

    let emailInput = String(request.body.email);
    let nameInput = String(request.body.name);
    let userResult = null;
    let emplResult = null;

    if(emailInput.match(/^(?=.{1,254}$)[-\w!#$%&'*+/=`{|}~?^]+(\.[-\w!#$%&'*+/=`{|}~?^]+)*@((\d{1,3}\.){3}\d{1,3}|([-\w]+\.)+[a-zA-Z]{2,6})$/g)[0] != emailInput 
        || emailInput.length === 0 
        || nameInput.match(/^[가-힣]{2,4}|[a-zA-Z]{2,10}$/g)[0] !== nameInput
        || nameInput.length === 0
        || emailInput.length > 254
        || nameInput.length > 254){

            response.render('info.html',{message:'html 변조가 감지되었습니다. 이메일의 양식을 지켜서 입력하세요',canGoBack:true});
        return;
    }
    
    try {
        userResult = await sequelize.models.user.findOne({where:{email:emailInput}});
        emplResult = await sequelize.models.employee.findOne({where:{email:emailInput}});
    } catch (error) {
        response.render('info.html',{message:'DB 작업에 실패했습니다. 나중에 다시 시도해주세요',canGoBack:true});
        return;
    }

    if(userResult === null || emplResult === null || userResult.accountType !== 'local' || emplResult.name !== nameInput){
        response.render('info.html',{message:'해당하는 정보가 없습니다. SNS계정으로 가입하신 분은 SNS를 통해 비밀번호를 바꿔주세요',canGoBack:true});
        return;
    }

    let prevChangeDate = userResult.lastchange;
    let reCurrentDate = new Date();
    if(reCurrentDate - prevChangeDate < 60 * 60 * 1000){
        response.render('info.html',{message:'비밀번호를 변경한 계정은 1시간 뒤에 변경할 수 있습니다.',canGoBack:false});
        return;
    }

    let tempHash = sha256(RandomStringGenerator(Math.random()*40 + 10));
    let length = tempHash.length;
    let tempPasswd = tempHash.substr(length - 8, length);
    let newSalt = sha256(RandomStringGenerator(parseInt(Math.random()*40) + 10));

    const transaction = await sequelize.transaction();

    try {
        await sequelize.models.user.update({passwd:sha256(tempPasswd + newSalt),salt:newSalt,needChange:true,lastchange:new Date()},{where:{email:emailInput}},{transaction});
        await Emailsend(emailInput,'비밀번호 재발급','비밀번호:'+tempPasswd);
        transaction.commit();
    } catch (error) {
        transaction.rollback();
        response.render('info.html',{message:'비밀번호 변경에 실패했습니다. 다시 시도해주세요.',canGoBack:true});
        return;
    }
    
    response.render('info.html',{message:'비밀번호 재발급이 완료되었습니다.',canGoBack:false});
})


export default commonRouter;
