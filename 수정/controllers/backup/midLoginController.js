import {checkUserAuth, checkAdminAuth} from './../Security/IdentifierGenerator';
import routes from "./../routers/RouterPath";

import passport from "passport";

export const preLoginFirewall = (request,response,next)=>{
    if(request.isAuthentication()){
        next();
    }else{
        //허용되지 않는 접근
    }
    return;
}

export const 
