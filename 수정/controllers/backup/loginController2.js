import {checkUserAuth, checkAdminAuth} from '../Security/IdentifierGenerator';
import routes from "../routes";
import Video from "../models/MovieInfo";
import User from "../models/User";

import passport from "passport";

//로그인 이후의 비밀번호 변경
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