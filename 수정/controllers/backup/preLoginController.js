import {checkUserAuth, checkAdminAuth} from './../Security/IdentifierGenerator';
import routes from "./../routers/RouterPath";

import passport from "passport";

export const preLoginFirewall = (request,response,next)=>{
    let value = checkBlackList(request.socket.remoteAddress);
    if(value !== 0){
        if(parseInt(value/1000) <= 60){
            //Todo : 차단시간 초단위
            //response.render('info.html',{message:`${parseInt(value/1000)}초 뒤에 다시 시도하세요`,canGoBack:true});
        }else{
            //Todo : 차단시간 분단위
            //response.render('info.html',{message:`${parseInt(value/1000/60)}분 뒤에 다시 시도하세요`,canGoBack:true});
        }
    }else{
        next();
    }
    return;
}

export const getLogOut = (request,response)=>{
  request.logout();
  response.redirect(routes.global.first_home);
}


export const getJoin = (request, response) => {
    if(request.isAuthenticate()){
        //로그인 한 사용자는 불가
        return;
    }
    response.render("Join", { pageTitle: "Join" });
  };

export const postJoin = async (request, response, next) => {
    if(request.isAuthenticate()){
        //로그인 한 사용자는 불가
        return;
    }

    const {
      body: { email, name, employeeNum, password, password2 }
    } = request;
  
    let emailInput = String(email);
    let nameInput = String(name);
    let emloyeeNumInput = parseInt(employeeNum);
    let passwordInput = String(password);
    let password2Input = String(password2);
  
    if(password !== password2){
      //ToDo -> 비밀번호 불일치 통보
      return;
    }
    //프론트에도 동일한 태그 적용
    let emailMatchresult = emailInput.match(/^(?=.{1,254}$)[-\w!#$%&'*+/=`{|}~?^]+(\.[-\w!#$%&'*+/=`{|}~?^]+)*@((\d{1,3}\.){3}\d{1,3}|([-\w]+\.)+[a-zA-Z]{2,6})$/g);
    let nameMatchResult = nameInput.match(/^[가-힣]{2,4}|[a-zA-Z]{2,10}$/g);
    let password1MatchResult = passwordInput.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g);
    let password2MatchResult = password2Input.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g);
  
    if((emailMatchresult === null || emailMatchresult[0] !=email) || emailInput.length === 0 || emailInput.length > 254 
        ||(nameMatchResult === null || nameMatchResult[0] !=name)  || nameInput.length === 0 || nameInput.length > 254
        ||(password1MatchResult === null || password1MatchResult[0] != passwordInput)  || passwordInput.length === 0 || passwordInput.length > 254
        ||(password2MatchResult === null || password2MatchResult[0] != password2Input)  || password2Input.length === 0 || password2Input.length > 254
        || Number.isInteger(emloyeeNumInput) || emloyeeNumInput < 0 || emloyeeNumInput >   2000000000
    ){
        //response.render('info.html',{message:'html 변조가 감지되었습니다.',canGoBack:true});
        addBlackListCount(request.socket.remoteAddress);
        //ToDO 오류 통보
      return;
    } 
  
    let whitelistResult = null;
    let existCheck = null;
    try {
      whitelistResult = await sequelize.models.whitelist.count({where:{email:emailInput, employeenum:employeeNum, name:nameInput}});
      existCheck = await sequelize.models.user.count({where:{email:emailInput}});
    } catch (error) {
      //Todo -> DB 오류
      
    }
  
    if(whitelistResult !== 1 || existCheck !== 0){
      //ToDo - > 해당 입력된 정보로는 가입이 불가능 합니다.
      return;
    }
    
    try {
      whitelistResult = await sequelize.models.whitelist.findOne({where:{email:emailInput,employeenum:employeeNum, name:nameInput}});
    } catch (error) {
      //Todo -> DB 오류
      return;
    }
    
    let grade = whitelistResult.grade;
    let tempHash = sha256(RandomStringGenerator(Math.random()*40 + 10));
    let length = tempHash.length;
    let verificationStr = tempHash.substr(length - 8, length);
    let newSalt = sha256(RandomStringGenerator(Math.random()*40 + 10));
  
    try {
      const transaction = await sequelize.transaction();
      
      await sequelize.models.whitelist.destroy({where:{email:emailInput,employeenum:employeeNum, name:nameInput}});
      await sequelize.models.user.create({email:emailInput, accountType:'local',passwd:sha256(passwordInput + newSalt),salt:newSalt,verification:verificationStr, lastchange:new Date(), needChange:false}, transaction);
      await sequelize.models.employee.create({email:emailInput, name:nameInput, employeenum:employeeNum, grade:grade,verified:false});
      await Emailsend(emailInput,'인증번호입니다',verificationStr);
      
      transaction.commit();
    } catch (error) {
      transaction.rollback();
      //Todo -> DB 오류
    }
    //ToDo ->   (등급: ~~~로 )회원가입이 완료되었습니다.
  };