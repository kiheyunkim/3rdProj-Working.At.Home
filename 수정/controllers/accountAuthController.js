import { addBlackListCount } from "../Security/BlackList";

export const accountAuthFirewall = (request,response,next)=>{
    if(request.isAuthenticated() && request.session.auth === undefined){
        next();
    }else{
        console.log('hi');
        addBlackListCount(request.socket.remoteAddress);
        response.redirect('/');
    }
}