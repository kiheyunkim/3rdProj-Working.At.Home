import {Router} from 'express';
import passport from 'passport';
import sequelize from './../../models/index';
import {checkBlackList} from '../../Security/BlackList'
const loginRouter = Router();

loginRouter.get('*',(request,response,next)=>{
    if(request.session.passport === undefined){
        let value = checkBlackList(request.socket.remoteAddress);
        if(value !== 0){
            if(parseInt(value/1000) <= 60){
                response.send(`${parseInt(value/1000)}초 뒤에 다시 시도하세요`);
            }else{
                response.send(`${parseInt(value/1000/60)}분 뒤에 다시 시도하세요`);
            }
        }else{
            next();
        }
    }else{
        next()
    }
})

loginRouter.get('/google',
    passport.authenticate('google',
    {scope: ['https://www.googleapis.com/auth/userinfo.email'], accessType: 'offline',  prompt: 'select_account'}),
    (request,response)=>{}
);

loginRouter.get('/facebook',(request,response)=>{
    
});

loginRouter.get('/twitter',(request,response)=>{
    
});

loginRouter.get('/github',(request,response)=>{
    
});

loginRouter.post('/local',passport.authenticate('local',{
        successRedirect:'/login/local/callback',
        failureRedirect:'error.html', 
        failureFlash:false,
    })
);

loginRouter.get('/google/callback',(request,response)=>{
    passport.authenticate('google', {
         failureRedirect: '/loginfail' 
    }),
    (request, response)=>{
        response.redirect("/");
    }
});

loginRouter.get('/local/callback',async (request,response)=>{
    let identifier = request.user.email;
    let getResult = await sequelize.models.user.findOne({email:identifier});

    if(getResult.datValues.needChange){
        //정보변경페이지
    }else{
        let authResult = await sequelize.models.employee.findOne({email:identifier});
        if(authResult.grade){
            
        }else{

        }
    }
});

export default loginRouter;