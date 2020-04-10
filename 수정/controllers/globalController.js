import {checkBlackList, addBlackListCount} from './../Security/BlackList';
import {checkAdminAuth, checkUserAuth, getAdminAuth, getUserAuth} from './../Security/IdentifierGenerator';
import routes from './../routers/RouterPath';
import sequelize from "./../models/index";
import passport from 'passport'
export const globalFirewall = (request,response,next)=>{
  console.log(request.session);
  if(checkBlackList(request.socket.remoteAddress) === -1){
    response.render('Info',{pageTitle:'Error!', message:"IP가 차단되었습니다. 관리자에게 문의하세요.",infoType:'home'});
    return;
  }

  if(request.session.remoteip === undefined){
    request.session.remoteip = request.socket.remoteAddress;
  }
  
  if(request.session.remoteip !== request.socket.remoteAddress){
    addBlackListCount(request.session.remoteip);
    request.logout();
    response.redirect(routes.global.root);
    return;
  }


  next();
}

export const firstHome = (request, response) => {
  if(request.isAuthenticated() && (checkAdminAuth(request.session.auth) || checkUserAuth(request.session.auth))){
    response.redirect(routes.working.video.origin + routes.working.video.root);
  }else{
    response.render("Init_Home", { pageTitle: "Init Home" });
  }
};

export const logout = (request,response)=>{
  if(request.isAuthenticated()){
    request.logout();
    response.redirect(routes.global.root);
  }
}

export const githubCallback = passport.authenticate('github', { failureRedirect: '/error' ,successRedirect:'/postCallback'});
export const googleCallback = passport.authenticate('google', { failureRedirect: '/error' ,successRedirect:'/postCallback'});
export const facebookCallback = passport.authenticate('facebook', { failureRedirect: '/error' ,successRedirect:'/postCallback'});
export const kakaoCallback = passport.authenticate('kakao', { failureRedirect: '/error' ,successRedirect:'/postCallback'});

export const postCallback = async (request, response) => {
  if(request.isAuthenticated()){
    let find = await sequelize.models.employee.findOne({where:{email:request.user.email}});
    if(find.dataValues.grade === 'admin'){
      request.session.auth = getAdminAuth();
    }else if(find.dataValues.grade === 'user'){
      request.session.auth = getUserAuth();
    }

    if(checkAdminAuth(request.session.auth) || checkUserAuth(request.session.auth)){
      response.redirect(routes.global.root);
      return;
    }else{
      if(request.user.type !== 'local'){
        response.render('question',{pageTitle:"Join?"});
      }
    }
  }else{
    addBlackListCount(request.session.remoteip);
    response.redirect(routes.global.root);
  }
};

export const getError = (request, response) => {
  response.render('Info',{pageTitle:'Error!', message:"에러가 발생했습니다.",infoType:'back'});
};