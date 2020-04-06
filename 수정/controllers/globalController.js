import routes from "../routes";
import User from "../models/User";
import sha256 from 'sha256';
import RandomStringGenerator from './../Security/RandomStringGenerator'
import {checkBlackList, addBlackListCount} from './../Security/BlackList';

export const globalFirewall = (request,response,next)=>{
  if(request.isAuthenticated() && request.session.auth === undefined){
    //이경우는 Passport는 로그인 했으나 회원가입이 되지 않아 권한이 없는 경우
    //ToDo -> 회원가입 강제이동
    return;
  }

  if(checkBlackList(request.socket.remoteAddress) === -1){
    response.status(404).send('IP가 차단되었습니다. 관리자에게 문의하세요');
    //ToDO -> 오류 통보
    return;
  }

  if(request.session.remoteip === undefined){
    request.session.remoteip = request.socket.remoteAddress;
  }else{
    if(request.session.remoteip !== request.socket.remoteAddress){
        addBlackListCount(request.session.remoteip);
        request.logout();
        //ToDO 첫 페이지로 이동
        return;
    }
  }  
  next();
}

export const firstHome = (request, response) => {
  response.render("Init_Home", { pageTitle: "Init Home" });
};

export const getJoin = (request, response) => {
  response.render("Join", { pageTitle: "Join" });
};

export const postJoin = async (request, response, next) => {
  const {
    body: { email, name, employeeNum, password, password2 }
  } = request;

  let emailInput = String(email);
  let nameInput = String(name);
  let emloyeeNum = parseInt(employeeNum);
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
      || emloyeeNum < 0 || emloyeeNum >   2000000000
  ){
      //response.render('info.html',{message:'html 변조가 감지되었습니다. 이메일의 양식을 지켜서 입력하세요',canGoBack:true});
      //ToDO 오류 통보
    return;
  } 

  let whitelistResult = null;
  let existCheck = null;
  try {
    whitelistResult = await sequelize.models.whitelist.count({where:{email:emailInput,employeenum:employeeNum, name:nameInput}});
    existCheck = await sequelize.models.user.count({where:{email:emailInput}});
  } catch (error) {
    //Todo -> DB 오류
    
  }

  if(whitelistResult !== 1){
    //ToDo - > 해당 입력된 정보로는 가입이 불가능 합니다.
    return;
  }

  if(existCheck !== 0){
    try {
      await sequelize.models.whitelist.destroy({where:{email:emailInput}});
    } catch (error) {
      //Todo -> DB 오류
      return;
    }

    //ToDo ->   해당 입력된 정보로는 가입이 불가능 합니다.
    return;
  }
  
  try {
    const transaction = await sequelize.transaction();
    await sequelize.models.whitelist.destroy({where:{email:emailInput,employeenum:employeeNum, name:nameInput}});

    let newSalt = sha256(RandomStringGenerator(Math.random()*40 + 10));
    
    sequelize.models.user.create({email:emailInput, accountType:'local',passwd:sha256(password2Input + newSalt),salt:newSalt, lastchange:new Date(), needChange:false}, transaction);

  } catch (error) {
    
  }
  


};

export const getLogin = (req, res) => {
  res.render("Login", { pageTitle: "LOGIN" });
};

export const passwordReset = async (request,response)=>{
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

  const transaction = await sequelize.transaction();

  try {
      await sequelize.models.user.update({passwd:sha256(tempPasswd + newSalt),salt:newSalt,needChange:true,lastchange:new Date()},{where:{email:emailInput}},{transaction});
      await Emailsend(emailInput,'비밀번호 재발급','비밀번호:'+tempPasswd);
      transaction.commit();
  } catch (error) {
      transaction.rollback();
      //response.render('info.html',{message:'비밀번호 변경에 실패했습니다. 다시 시도해주세요.',canGoBack:true});
      //ToDO 오류 통보
      return;
  }
  
  //response.render('info.html',{message:'비밀번호 재발급이 완료되었습니다.',canGoBack:false});
  //ToDO 성공 통보
}