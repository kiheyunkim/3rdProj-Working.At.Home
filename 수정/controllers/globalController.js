import {checkBlackList, addBlackListCount} from './../Security/BlackList';
import {checkAdminAuth, checkUserAuth} from './../Security/IdentifierGenerator';
import routes from './../routers/RouterPath';
import passport from 'passport'
export const globalFirewall = (request,response,next)=>{
  if(checkBlackList(request.socket.remoteAddress) === -1){
    response.render('Info',{message:"IP가 차단되었습니다. 관리자에게 문의하세요.",infoType:'home'});
    return;
  }

  if(request.session.remoteip === undefined){
    request.session.remoteip = request.socket.remoteAddress;
  }

  
  if(request.session.remoteip !== request.socket.remoteAddress){
    addBlackListCount(request.session.remoteip);
    request.logout();
    response.redirect('/');
    return;
  }

  next();
}

export const firstHome = (request, response) => {
  response.render("Init_Home", { pageTitle: "Init Home" });
};

export const logout = (request,response)=>{
  if(request.isAuthenticated()){
    request.logout();
    response.redirect('/');
  }
}

export const githubCallback = passport.authenticate('github', { failureRedirect: '/' ,successRedirect:'/postCallback'});
export const googleCallback = passport.authenticate('google', { failureRedirect: '/' ,successRedirect:'/postCallback'});
export const facebookCallback = passport.authenticate('facebook', { failureRedirect: '/' ,successRedirect:'/postCallback'});
export const kakaoCallback = passport.authenticate('kakao', { failureRedirect: '/' ,successRedirect:'/postCallback'});

export const postCallback = (request, response) => {
  console.log(request.session);
  if(request.isAuthenticated()){
    console.log(request.session.auth);
    if(checkAdminAuth(request.session.auth) || checkUserAuth(request.session.auth)){
      response.redirect('/');
      return;
    }else{
      if(request.user.type === 'local'){
        response.redirect(routes.login.accountAuth.local.origin + routes.login.accountAuth.local.accountAuth);
      }else{
        response.render('question',{pageTitle:"Join?"});
      }
    }
  }else{
    addBlackListCount(request.session.remoteip);
    response.redirect('/');
  }
};