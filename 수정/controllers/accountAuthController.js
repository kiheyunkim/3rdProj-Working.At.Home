import { addBlackListCount } from "../Security/BlackList";

export const accountAuthFirewall = (request,response,next)=>{
    if(request.isAuthenticated() && request.session.auth === undefined){
        next();
    }else{
        //접근 금지
    }
}

export const getJoinSocial = (request, response) => {
    response.render("Join", { pageTitle: "Join" });
};
  
export const postJoinSocial = async (request, response, next) => {
    const {
      body: {name, employeeNum}
    } = request;
  
    let nameInput = String(name);
    let emloyeeNumInput = parseInt(employeeNum);
  
    //프론트에도 동일한 태그 적용
    let nameMatchResult = nameInput.match(/^[가-힣]{2,4}|[a-zA-Z]{2,10}$/g);
  
    if((   nameMatchResult === null || nameMatchResult[0] !=name)  || nameInput.length === 0 || nameInput.length > 254
        || Number.isInteger(emloyeeNumInput) || emloyeeNumInput < 0 || emloyeeNumInput >   2000000000)
        {
          //response.render('info.html',{message:'html 변조가 감지되었습니다. 이메일의 양식을 지켜서 입력하세요',canGoBack:true});
          addBlackListCount(request.socket.remoteAddress);
        //ToDO 오류 통보
      return;
    } 
  
    let whitelistResult = null;
    let existCheck = null;
    try {
      whitelistResult = await sequelize.models.whitelist.count({where:{email:request.user.email, employeenum:employeeNum, name:nameInput}});
      existCheck = await sequelize.models.user.count({where:{email:request.user.email}});
    } catch (error) {
      //Todo -> DB 오류
      
    }
  
    if(whitelistResult !== 1 || existCheck !== 0){
      //ToDo - > 해당 입력된 정보로는 가입이 불가능 합니다.
      return;
    }
    
    try {
      whitelistResult = await sequelize.models.whitelist.findOne({where:{email:request.user.email,employeenum:employeeNum, name:nameInput}});
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
      await Emailsend(emailInput,'인증번호입니다', verificationStr);
  
      //이메일 전송
    } catch (error) {
      transaction.rollback();
      //Todo -> DB 오류
    }
  
    //ToDo ->   (등급: ~~~로 )회원가입이 완료되었습니다.
  };

  export const getAuthAccount = async (request, response, next) => {
  }

  export const postAuthAccount = async (request, response, next) => {
  }

  export const getquestion = async (request, response, next) => {
  }