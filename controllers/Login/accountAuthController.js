import { addBlackListCount } from "./../../Security/BlackList";

export const accountAuthFirewall = (request,response,next)=>{
    if(request.isAuthenticated() && request.session.auth === undefined){
        next();
    }else{
        addBlackListCount(request.socket.remoteAddress);
        response.redirect('/');
    }
}