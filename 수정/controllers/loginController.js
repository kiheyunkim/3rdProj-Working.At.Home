import {checkUserAuth, checkAdminAuth} from './../Security/IdentifierGenerator';
import routes from "../routes";
import Video from "../models/MovieInfo";
import User from "../models/User";

import passport from "passport";

export const loginFirewall = (request,response,next)=>{
  if(request.isUnauthenticated()){
    addBlackListCount(request.socket.remoteAddress);
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
    next();
    return;
}
}

export const getLogin = (request, response) => {
  response.render("Login", { pageTitle: "LOGIN" });
};
  
//##0.Local 영역
export const postLogin = passport.authenticate('local',{
    successRedirect: routes.home,
    failureRedirect: routes.login
});
//##1.Github 영역
export const githubLogin = passport.authenticate("github");
//#2.Google 영역
export const googleLogin = passport.authenticate("google", { scope: [
  'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'],
  accessType: "offline",
  prompt: "select_account"
});
//#3.Facebook 영역
export const facebookLogin = passport.authenticate("facebook");

export const passportCallBack = (request, response) => {
  if(checkAdminAuth(request.session.auth)){
    //ToDO -> 관리자에 대한 이동
  }else if(checkUserAuth(reuqest,session,auth)){
    //ToDo -> 일반 사용자에 대한 이동
  }else{
    //건방진 접근 -> 차단
  }

  //res.redirect(routes.home);
};

export const logout = (request, response) => {
    request.logout();
    response.redirect(routes.first_home);
};

export const loginPasswordReset = async (request,response)=>{
  try {
      let getUserInfo = await sequelize.models.user.findOne({where:{email:request.user.email}});
      let password = request.body.currentPw;
      let salt = getUserInfo.salt;

      if(getUserInfo.passwd !== sha256(password + salt)){
          response.render('info.html',{message:'기존 비밀번호가 맞지 않습니다.',canGoBack:true});
          return;
      }
  
      if(request.body.newPw1 !== request.body.newPw2){
          response.render('info.html',{message:'새 비밀번호가 일치하지 않습니다.',canGoBack:true});
          return;
      }
      
      let newSalt = sha256(RandomStringGenerator(parseInt(Math.random()*40) + 10));
      await sequelize.models.user.update({passwd:sha256(request.body.newPw1 + newSalt),salt:newSalt,needChange:false},{where:{email:request.user.email}});
 
      if(checkUserAuth(request.session.auth)){
          response.render('employee.html');
      }else if(checkAdminAuth(request.session.auth)){
          response.render('admin/admin.html');
      }else{
          response.render('error.html');
      }
  } catch (error) {
      response.render('error.html');
  }finally{
  }
}

export const loginPasswordResetSkip = (request,response)=>{
  if(checkUserAuth(request.session.auth)){
      response.render('/user/main');
  }else if(checkAdminAuth(request.session.auth)){
      response.redirect('/admin/main');
  }else{
      response.render('error.html');
  }
}












//이하 폐기

//구글 인증 성공했을 때 redirect
export const postGoogleLogin = (req, res) => {
  res.redirect(routes.home);
};

//깃허브 인증 성공했을 때 redirect
export const postGithubLogin = (req, res) => {
  res.redirect(routes.home);
};

//페이스북 인증 성공했을 때 redirect
export const postFacebookLogin = (req, res) => {
  res.redirect(routes.home);
};

//#3.Facebook 영역  -> 제거 예정
export const facebookLoginCallback = async (
    accessToken,
    refreshToken,
    profile,
    cb
  ) => {
    //console.log(accessToken, refreshToken, profile, cb);
  
    const {
      _json: { id, name, email }
    } = profile;
  
    try {
      const user = await User.findOne({ email });
  
      if (user) {
        user.facebookId = id;
        user.avatarUrl = `https://graph.facebook.com/${id}/picture?type=large`;
        user.save();
        return cb(null, user);
      }
      const newUser = await User.create({
        email,
        name,
        facebookId: id,
        avatarUrl: `https://graph.facebook.com/${id}/picture?type=large`
      });
      return cb(null, newUser);
    } catch (error) {
      return cb(error);
    }
};