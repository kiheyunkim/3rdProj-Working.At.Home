import { addBlackListCount,checkBlackList } from "../Security/BlackList";

export const loginFirewall = (request,response,next)=>{
    if(request.isUnauthenticated() || (request.isAuthenticated() && request.session.auth === undefined)){
        let value = checkBlackList(request.socket.remoteAddress);
        if(value !== 0){
            if(parseInt(value/1000) <= 60){
                //Todo : 차단시간 초단위
                //response.render('info.html',{message:`${parseInt(value/1000)}초 뒤에 다시 시도하세요`,canGoBack:true});
            }else{
                //Todo : 차단시간 분단위
                //response.render('info.html',{message:`${parseInt(value/1000/60)}분 뒤에 다시 시도하세요`,canGoBack:true});
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