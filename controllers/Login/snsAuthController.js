import { addBlackListCount } from "../../Security/BlackList";
import sequelize from '../../models/index';
import RandomStringGenerator from './../../Security/RandomStringGenerator';
import {getAdminAuth, getUserAuth} from './../../Security/IdentifierGenerator';
import sha256 from 'sha256';
export const accountAuthSnsFirewall = (request,response,next)=>{
    if(request.user.type !== 'local'){
        next();
    }else{
      addBlackListCount(request.socket.remoteAddress);
      response.redirect('/');
    }
}

export const getJoinSocial = (request, response) => {
    response.render("Snsjoin", { pageTitle: "Join", email:request.user.email});
};
  
export const postJoinSocial = async (request, response, next) => {
    const {
      body: {name, employeenum}
    } = request;
  
    let nameInput = String(name);
    let emloyeeNumInput = parseInt(employeenum);
  
    //프론트에도 동일한 태그 적용
    let nameMatchResult = nameInput.match(/^[가-힣]{2,4}|[a-zA-Z]{2,10}$/g);
    console.log(nameInput,emloyeeNumInput, nameMatchResult);
    if(( nameMatchResult === null || nameMatchResult[0] != nameInput)  
        || nameInput.length === 0 || nameInput.length > 254
        || !Number.isInteger(emloyeeNumInput) || emloyeeNumInput < 0 || emloyeeNumInput > 2000000000)
        {
          response.render('Info',{message:"가입 실패: html 변조감지.",infoType:'back'});
          addBlackListCount(request.socket.remoteAddress);
      return;
    } 
  
    let whitelistResult = null;
    let existCheck = null;
    try {
      whitelistResult = await sequelize.models.whitelist.count({where:{email:request.user.email, employeenum:emloyeeNumInput, name:nameInput}});
      existCheck = await sequelize.models.user.count({where:{email:request.user.email}});
    } catch (error) {
      response.render('Info',{message:"DB 오류.",infoType:'back'});
      return;
    }
  
    if(whitelistResult !== 1 || existCheck !== 0){
      response.render('Info',{message:"해당 정보로는 가입할 수 없습니다.",infoType:'back'});
      return;
    }
    
    try {
      whitelistResult = await sequelize.models.whitelist.findOne({where:{email:request.user.email,employeenum:emloyeeNumInput, name:nameInput}});
    } catch (error) {
      response.render('Info',{message:"DB 오류.",infoType:'back'});
      return;
    }
    
    let grade = whitelistResult.grade;
  
    let transaction=null;
    try {
      transaction = await sequelize.transaction();
      
      await sequelize.models.whitelist.destroy({where:{email:request.user.email,employeenum:emloyeeNumInput, name:nameInput}}, {transaction});
      await sequelize.models.user.create({email:request.user.email, accountType:request.user.type,passwd:' ',salt:' ',verification:' ', lastchange:new Date(), needChange:false}, {transaction});
      await sequelize.models.employee.create({email:request.user.email, name:nameInput, employeenum:emloyeeNumInput, grade:grade,verified:false}, {transaction});
      await transaction.commit();
      //이메일 전송
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      response.render('Info',{message:"DB 오류.",infoType:'back'});
      return;
    }

    if(grade === 'admin'){
      request.session.auth = getAdminAuth();
    }else if(grade === 'admin'){
      request.session.auth = getUserAuth();
    }

  
    response.redirect('/');
};
