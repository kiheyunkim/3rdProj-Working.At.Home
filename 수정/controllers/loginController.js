import { addBlackListCount,checkBlackList } from "../Security/BlackList";

export const loginFirewall = (request,response,next)=>{
    console.log('loginFirewall');
    if(request.isUnauthenticated() || (request.isAuthenticated() && request.session.auth === undefined)){
        let value = checkBlackList(request.socket.remoteAddress);
        if(value !== 0){
            if(parseInt(value/1000) <= 60){
                response.render('Info',{message:`IP가 차단되었습니다. ${parseInt(value/1000)}초 뒤에 다시 시도하세요`,infoType:'back'});
            }else{
                response.render('Info',{message:`IP가 차단되었습니다. ${parseInt(value/1000/60)}분 뒤에 다시 시도하세요`,infoType:'back'});
            }
            return;
        }else{
            next();
            return;
        }
    }else{
          addBlackListCount(request.socket.remoteAddress);
          response.redirect('/');
    }
}