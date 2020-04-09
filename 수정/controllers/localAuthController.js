import { addBlackListCount } from "../Security/BlackList";
import {setIdentifier, setAdminAuth} from '../Security/IdentifierGenerator';
import sequelize from "./../models/index";

export const accountAuthLocalFirewall = (request,response,next)=>{
    if(request.user.type === 'local'){
        next();
    }else{
        addBlackListCount(request.socket.remoteAddress);
        response.redirect('/');
    }
}

export const getAuthAccount = (request, response) => {
    response.render('accountauth',{pageTitle:'Email 인증'});
}

export const postAuthAccount = async (request, response) => {
    //ToDo 횟수 제한 걸어야함.
    let authInfo = String(request.body.authnum);
    let regexResult = authInfo.match(/^[A-Fa-f0-9]{8}$/g);
    if(regexResult === null || regexResult[0] !== authInfo){
        response.render('Info',{message:"인증 실패 : html 변조",infoType:'back'});
        return;
    }

    let result = null;
    try {
        result = await sequelize.models.user.findOne({where:{email:request.user.email, accountType:request.user.type}});
    } catch (error) {
        console.log(error);
        response.render('Info',{message:"DB 오류",infoType:'back'});
        return;
    }

    console.log(result.verification , authInfo);

    if(result.verification !== authInfo){
        response.render('Info',{message:"인증번호 불일치",infoType:'back'});
        return;
    }

    try {
        await sequelize.models.user.update({verified:true},{where:{email:request.user.email, accountType:request.user.type}});
    } catch (error) {
        console.log(error);
        response.render('Info',{message:"DB 오류",infoType:'back'});
        return;
    }

    //setIdentifier, setAdminAuth

    //계정이 인증되었습니다.
    response.render('Info',{message:"계정 인증이 완료되었습니다.",infoType:'home'});
}
