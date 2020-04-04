import { readFileSync } from 'fs';
import sha256 from 'sha256'
import passport from 'passport';
import { Strategy as googleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import sequelize  from './../models/index';

const passportInfo = JSON.parse(readFileSync(__dirname+ '/../AuthInfo/passportInfo.json',{encoding:'UTF-8'}));

export default (app)=>{
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new googleStrategy({
        clientID: passportInfo.GOOGLE.CLIENT_ID,
        clientSecret: passportInfo.GOOGLE.CLIENT_SECRET,
        callbackURL: passportInfo.GOOGLE.CALLBACK_URL
    },
    (accessToken, refreshToken, profile, done)=> {      //로그인 되는 순간에 불러온다.
        // asynchronous verification, for effect...
        process.nextTick( ()=>{
          // To keep the example simple, the user's Google profile is returned to
          // represent the logged-in user.  In a typical application, you would want
          // to associate the Google account with a user record in your database,
          // and return that user instead.
          return done(null, profile.emails);
        });
    }));

    passport.use(new LocalStrategy({
        passReqToCallback:true
    },async(request,username,password,done)=>{
        try {
            let data = await sequelize.models.user.count({where:{email:username}});
            
            if(data !== 1){
                throw new Error('email Not Match');
            }

            let info = await sequelize.models.user.findOne({where:{email:username}});
            let result = await sequelize.models.user.count({where:{email:username, passwd:sha256(password + info.dataValues.salt)}});
            if(result !== 1){
                throw new Error('passwd Not Match');
            }
        } catch (error) {
            return done(null, false,{});
        }

        return done(null,{email:username});
    }))

    passport.serializeUser((user,done)=>{//로그인 직후에 검증된 값을 세션에 저장
        done(null,user);
    });

    passport.deserializeUser((users,done)=>{//세션에 저장된 값을 requst.user를 통해 가져올 때
        done(null,users);
    });
}