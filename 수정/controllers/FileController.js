import {addBlackListCount} from './../Security/BlackList';
import {checkAdminAuth, checkUserAuth} from './../Security/IdentifierGenerator';
import routes from './../routers/RouterPath';
import fs from 'fs';
import sequelize from './../models/index';
let path = process.cwd()+'\\uploads\\videos\\';

export const fileFirewall = (request,response,next)=>{
  next();
}

export const getFile = async (request,response)=>{
    let fileName = request.query.fileName;
    let canGetAll = false;
    console.log(fileName + " requested");
    //0차. 권한 확인
    if(checkAdminAuth(request.session.auth)){
        canGetAll=true;
    }else if(checkUserAuth(request.session.auth)){
        canGetAll=false;
    }else{
        addBlackListCount(request.socket.remoteAddress);
        response.status(404);
        return;
    }

    //1차. 요청할 수 있는 파일인가?
    if(!canGetAll){//유저는 검사를 해야함
        let findCount = await sequelize.models.videos.count({where:{email:request.user.email,filename:fileName}});
        if(findCount!==0){
            response.status(404);
            return;
        }
    }
    
    //2차. 파일이 있는가?
    if(!fs.existsSync(path + fileName)){
        response.status(404);
        return;
    }
    //3차. 파일을 전송하자

    //4차. 오류가 발생하면 오류를 전송해주자
    response.sendFile(path+fileName,(Errback)=>{
       if(Errback){
            response.status(404);
       }
    });
}