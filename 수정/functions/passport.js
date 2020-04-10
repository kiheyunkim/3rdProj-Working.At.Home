import routes from "../routers/RouterPath";
import sequelize from "../models/index";

import dotenv from "dotenv";
import sha256 from 'sha256';
import passport from "passport";
import GithubStrategy from "passport-github2";
import GoogleStrategy from "passport-google-oauth20";
import LocalStrategy from 'passport-local';
import FaceBookStrategy from "passport-facebook";
import {getAdminAuth, getUserAuth} from '../Security/identifierGenerator'

let processingStrategy = async (accessToken, refreshToken, profile, done, type)=>{
  const {_json:{ name, email}} = profile;
  let picUrl = null;
  if(type ==='google'){
    const {_json:{picture}} = profile;
    picUrl = picture;
  }else if (type ==='github'){
    const {_json:{avatar_url}} = profile;
    picUrl = avatar_url;
  }else if(type === 'facebook'){
    const {_json:{id}} = profile;
    picUrl = `https://graph.facebook.com/${id}/picture?type=large`;
  }
  
  let info = {name, picture:picUrl, email};
  
  try {
    let result = await sequelize.models.user.findOne({where:{email:info.email, accountType:type}});
    if(result === 1){
      let userInfo = await sequelize.models.employee.findOne({where:{email:info.email}});
      if(userInfo.grade === 'admin'){
        info.authStr = getAdminAuth();
      }else if(userInfo.grade === 'user'){
        info.authStr = getUserAuth();
      }
    }
  } catch (error) {
    return done(error);
  }
  return done(null, info);
}

export default (app)=>{
  dotenv.config();
  app.use(passport.initialize());
  app.use(passport.session());

  //Google 정책//OK
  passport.use(new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: `https://127.0.0.1:8443${routes.global.passportCallback.google}`
      },
      async (accessToken, refreshToken, profile, done)=>
        processingStrategy(accessToken, refreshToken, profile, done,'google')
  )
  );
  
  //Github 정책//OK
  passport.use(new GithubStrategy(
      {
        clientID: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
        callbackURL: `https://127.0.0.1:8443${routes.global.passportCallback.github}`,
        scope: ["email"],
      },
      async (accessToken, refreshToken, profile, done)=>
        processingStrategy(accessToken, refreshToken, profile, done,'github')
    )
  );

  //Facebook 정책
  passport.use(new FaceBookStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: `https://7264656a.ngrok.io${routes.facebook_callback}`,
        profileFields: ["id", "displayName", "photos", "email"],
        scope: ["public_profile", "email"],
      },
      async (accessToken, refreshToken, profile, done)=>
        processingStrategy(accessToken, refreshToken, profile, done,'facebook')
    )
  );

  //로컬 정책//OK
  passport.use(new LocalStrategy({
    passReqToCallback:false
    },
    async(email, password, done)=>{
        try{
          let data = await sequelize.models.user.findOne({where:{email:email}});
          if(data === null){
            throw new Error('email Not Match');
          }

          let result = await sequelize.models.user.count({where:{email:email, passwd:sha256(password + data.dataValues.salt)}});
          if(result !== 1){
              throw new Error('passwd Not Match');
          }
        }catch(error){
          console.log(error);
          return done(null, false);
        }

        return done(null,{email:email, type:'local'});
     })
  );

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
}