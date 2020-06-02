import { addBlackListCount } from "../Security/BlackList";
import {checkAdminAuth, checkUserAuth} from '../Security/IdentifierGenerator';

export const workingFirewall = (request,response,next)=>{
    if(request.isAuthenticated() && (checkAdminAuth(request.session.auth) || checkUserAuth(request.session.auth))){
        next();
    }else{
      addBlackListCount(request.socket.remoteAddress);
      response.redirect('/');
    }
}