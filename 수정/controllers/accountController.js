import { addBlackListCount } from "../Security/BlackList";
import {Emailsend} from './../functions/MailSend';
import passport from 'passport';
import routes from './../routers/RouterPath';
import sequelize from './../models/index';
import RandomStringGenerator from '../Security/RandomStringGenerator';

import sha256 from 'sha256';

export const accountFirewall = (request,response,next)=>{
    if(!request.isAuthenticated()){
        next();
    }else{
      addBlackListCount(request.socket.remoteAddress);
      response.redirect('/');
    }
}

export const getJoin = (request, response) => {
    response.render("Join", { pageTitle: "Join" });
};

export const postJoin = async (request, response) => {
    const {
      body: { email, name, employeenum, password, password2 }
    } = request;
  
    console.log(email, name, employeenum, password, password2 );

    let emailInput = String(email);
    let nameInput = String(name);
    let emloyeeNumInput = parseInt(employeenum);
    let passwordInput = String(password);
    let password2Input = String(password2);
  
    if(password !== password2){
      response.render('Info',{message:"비밀번호가 불일치.",infoType:'back'});
      return;
    }

    //프론트에도 동일한 태그 적용
    let emailMatchresult = emailInput.match(/(?=.{1,254}$)[-\w!#$%&'*+/=`{|}~?^]+(\.[-\w!#$%&'*+/=`{|}~?^]+)*@((\d{1,3}\.){3}\d{1,3}|([-\w]+\.)+[a-zA-Z]{2,6})$/g);
    let nameMatchResult = nameInput.match(/^[가-힣]{2,4}|[a-zA-Z]{2,10}$/g);
    let password1MatchResult = passwordInput.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g);
    let password2MatchResult = password2Input.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g);

    if((emailMatchresult === null || emailMatchresult[0] !=email)
        ||(nameMatchResult === null || nameMatchResult[0] !=name)
        ||(password1MatchResult === null || password1MatchResult[0] != passwordInput)  || passwordInput.length === 0 || passwordInput.length > 254
        ||(password2MatchResult === null || password2MatchResult[0] != password2Input)  || password2Input.length === 0 || password2Input.length > 254
        || !Number.isInteger(emloyeeNumInput) || emloyeeNumInput < 0 || emloyeeNumInput > 2000000000
    ){
      response.render('Info',{message:"가입 실패: html 변조감지.",infoType:'back'});
      addBlackListCount(request.socket.remoteAddress);
      return;
    } 
    
    let whitelistResult = null;
    let existCheck = null;
    try {
      whitelistResult = await sequelize.models.whitelist.findOne({where:{email:emailInput, employeenum:emloyeeNumInput, name:nameInput}});
      existCheck = await sequelize.models.user.count({where:{email:emailInput}});
    } catch (error) {
      response.render('Info',{message:"DB 오류.",infoType:'back'});
      return;
    }
  
    let currentDate = new Date();
    if(whitelistResult === null || existCheck !== 0 ||  (currentDate.getTime() - whitelistResult.dataValues.addDate.getTime()) > 3 * 60 * 60 * 1000){
      response.render('Info',{message:"가입불가능한 계정입니다.",infoType:'back'});
      return;
    }
    
    let grade = whitelistResult.dataValues.grade;
    let tempHash = sha256(RandomStringGenerator(Math.random()*40 + 10));
    let length = tempHash.length;
    let verificationStr = tempHash.substr(length - 8, length);
    let newSalt = sha256(RandomStringGenerator(Math.random()*40 + 10));
    console.log();
    
    let transaction = null;

    try {
      transaction = await sequelize.transaction();
      await sequelize.models.whitelist.destroy({where:{email:emailInput, employeenum:emloyeeNumInput, name:nameInput}},{transaction});
      let result333 = await sequelize.models.user.create({email:emailInput, accountType:"local",passwd:sha256(passwordInput + newSalt),salt:newSalt,verification:verificationStr,verified:false, lastchange:new Date(), needChange:false}, {transaction});
      console.log(result333);
      console.log({email:emailInput, name:'김민경', employeenum:parseInt(emloyeeNumInput), grade:'admin', verified:false}),{transaction};
      let result222 = await sequelize.models.employee.create({email:emailInput, name:'김민경', employeenum:parseInt(emloyeeNumInput), grade:'admin', verified:false},{transaction});
      console.log(result222);
      //await Emailsend(emailInput, '인증번호입니다', verificationStr);

      transaction.commit(); 
    } catch (error) {
      console.log(error);
      if(transaction !== null){
        await transaction.rollback();
      }
      response.render('Info',{message:"DB 오류",infoType:'back'});;
      return;
    }

    response.render('Info',{message:"가입이 완료되었습니다.", infoType:'login'});
};

export const getPasswordReset = (request,response)=>{
  response.render('ResetPassword',{pageTitle:"passwordReset"});
}

export const postPasswordReset = async (request,response)=>{
    if(request.isAuthenticated()){
        response.render('Info',{message:"로그인 된 사용자는 내부 메뉴를 이용해주세요.",infoType:'back'});
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
          response.render('Info',{message:"30분 뒤에 다시 이용해주세요.",infoType:'back'});
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
          response.render('Info',{message:"비밀번호 발급실패: html 변조 감지",infoType:'back'});
          addBlackListCount(request.socket.remoteAddress);
        return;
    }
    
    try {
        userResult = await sequelize.models.user.findOne({where:{email:emailInput}});
        emplResult = await sequelize.models.employee.findOne({where:{email:emailInput}});
    } catch (error) {
        response.render('Info',{message:"DB오류",infoType:'back'});
        return;
    }
  
    if(userResult === null || emplResult === null || userResult.accountType !== 'local' || emplResult.name !== nameInput){
        response.render('Info',{message:"해당하는 정보가 없습니다. SNS계정으로 가입하신 분은 SNS를 통해 비밀번호를 바꿔주세요",infoType:'back'});
        return;
    }
  
    let prevChangeDate = userResult.lastchange;
    let reCurrentDate = new Date();
    if(reCurrentDate - prevChangeDate < 60 * 60 * 1000){
        response.render('Info',{message:"비밀번호를 변경한 계정은 1시간 뒤에 변경할 수 있습니다",infoType:'back'});
        return;
    }
  
    let tempHash = sha256(RandomStringGenerator(Math.random()*40 + 10));
    let length = tempHash.length;
    let tempPasswd = tempHash.substr(length - 8, length);
    let newSalt = sha256(RandomStringGenerator(parseInt(Math.random()*40) + 10));
  
    try {
        const transaction = await sequelize.transaction();
        await sequelize.models.user.update({passwd:sha256(tempPasswd + newSalt),salt:newSalt,needChange:true,lastchange:new Date()},{where:{email:emailInput}},{transaction});
        await Emailsend(emailInput,'비밀번호 재발급','비밀번호:'+ tempPasswd);
  
        transaction.commit();
    } catch (error) {
        await transaction.rollback();
        response.render('Info',{message:"비밀번호 변경에 실패했습니다. 다시 시도해주세요.",infoType:'back'});
        return;
    }

    response.render('Info',{message:"비밀번호 변경에 실패했습니다. 다시 시도해주세요.",infoType:'exit'});
};

export const getLogin = (request, response) => {
    response.render("Login", { pageTitle: "LOGIN" });
};

//##0.Local 영역
export const postLogin = passport.authenticate('local',{
    successRedirect: '/postCallback',
    failureRedirect: routes.global.root
});

export const githubLogin = passport.authenticate("github");

export const googleLogin = passport.authenticate('google', { scope: [
    'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'],
    prompt: "select_account",
    accessType:"offline"
});

export const facebookLogin = passport.authenticate("facebook");

export const getJoinSocial = (request, response) => {
  response.render("Join", { pageTitle: "Join" });
};
