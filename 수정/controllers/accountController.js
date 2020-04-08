import { addBlackListCount } from "../Security/BlackList";
import {Emailsend} from './MailSend';
import passport from 'passport';
import routes from './../routers/RouterPath';
export const accountFirewall = (request,response,next)=>{
    if(!request.isAuthenticated()){
        next();
    }else{
        //접근 금지
    }
}

export const getJoin = (request, response) => {
    response.render("Join", { pageTitle: "Join" });
};

export const postJoin = async (request, response, next) => {
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
  /*
    if((emailMatchresult === null || emailMatchresult[0] !=email) || emailInput.length === 0 || emailInput.length > 254 
        ||(nameMatchResult === null || nameMatchResult[0] !=name)  || nameInput.length === 0 || nameInput.length > 254
        ||(password1MatchResult === null || password1MatchResult[0] != passwordInput)  || passwordInput.length === 0 || passwordInput.length > 254
        ||(password2MatchResult === null || password2MatchResult[0] != password2Input)  || password2Input.length === 0 || password2Input.length > 254
        || Number.isInteger(emloyeeNumInput) || emloyeeNumInput < 0 || emloyeeNumInput >   2000000000
    ){
      console.log('in');
        //response.render('info.html',{message:'html 변조가 감지되었습니다.',canGoBack:true});
        addBlackListCount(request.socket.remoteAddress);
        //ToDO 오류 통보
      return;
    } 
    */
  
    let whitelistResult = null;
    let existCheck = null;
    try {
      whitelistResult = await sequelize.models.whitelist.count({where:{email:emailInput, employeenum:employeeNum, name:nameInput}});
      existCheck = await sequelize.models.user.count({where:{email:emailInput}});
    } catch (error) {
      //Todo -> DB 오류
      console.log('whiteList 없음');
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

export const getPasswordReset = ()=>{
  
}

export const postPasswordReset = async (request,response)=>{
    if(request.isAuthenticated()){
        //response.render('info.html',{message:'로그인 된 사용자는 내부 메뉴를 이용해주세요',canGoBack:fasle});
        //ToDO 오류 통보
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
            //response.render('info.html',{message:'30분 뒤에 다시 시도해주세요',canGoBack:false});
            //ToDO 오류 통보
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
  
            //response.render('info.html',{message:'html 변조가 감지되었습니다. 이메일의 양식을 지켜서 입력하세요',canGoBack:true});
            //ToDO 오류 통보
        return;
    }
    
    try {
        userResult = await sequelize.models.user.findOne({where:{email:emailInput}});
        emplResult = await sequelize.models.employee.findOne({where:{email:emailInput}});
    } catch (error) {
        //response.render('info.html',{message:'DB 작업에 실패했습니다. 나중에 다시 시도해주세요',canGoBack:true});
        //ToDO 오류 통보
        return;
    }
  
    if(userResult === null || emplResult === null || userResult.accountType !== 'local' || emplResult.name !== nameInput){
        //response.render('info.html',{message:'해당하는 정보가 없습니다. SNS계정으로 가입하신 분은 SNS를 통해 비밀번호를 바꿔주세요',canGoBack:true});
        //ToDO 오류 통보
        return;
    }
  
    let prevChangeDate = userResult.lastchange;
    let reCurrentDate = new Date();
    if(reCurrentDate - prevChangeDate < 60 * 60 * 1000){
        //response.render('info.html',{message:'비밀번호를 변경한 계정은 1시간 뒤에 변경할 수 있습니다.',canGoBack:false});
        //ToDO 오류 통보
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
        transaction.rollback();
        //response.render('info.html',{message:'비밀번호 변경에 실패했습니다. 다시 시도해주세요.',canGoBack:true});
        //ToDO 오류 통보
        return;
    }
};

export const getLogin = (request, response) => {
    response.render("Login", { pageTitle: "LOGIN" });
};

//##0.Local 영역
export const postLogin = passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: routes.login.account.origin + routes.login.account.login
});
//##1.Github 영역
export const githubLogin = passport.authenticate("github");
//#2.Google 영역
export const googleLogin = passport.authenticate("google", { scope: [
    'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'],
    accessType: "offline",
    prompt: "select_account"
});
//#3.Facebook 영역
export const facebookLogin = passport.authenticate("facebook");

export const getJoinSocial = (request, response) => {
  response.render("Join", { pageTitle: "Join" });
};
