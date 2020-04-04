import {Router} from 'express';
import passport from 'passport';
import sha256 from 'sha256'
import sequelize from './../../models/index';
import {checkBlackList, addBlackListCount} from '../../Security/BlackList'
import RandomStringGenerator from './../../Security/RandomStringGenerator'
import {getAdminAuth, getUserAuth, checkUserAuth, checkAdminAuth} from '../../Security/identifierGenerator'
const loginRouter = Router();

loginRouter.get('*',(request,response,next)=>{
    if(request.isUnauthenticated()){
        addBlackListCount(request.socket.remoteAddress);
        let value = checkBlackList(request.socket.remoteAddress);
        if(value !== 0){
            if(parseInt(value/1000) <= 60){
                response.render('info.html',{message:`${parseInt(value/1000)}초 뒤에 다시 시도하세요`,canGoBack:true});
            }else{
                response.render('info.html',{message:`${parseInt(value/1000/60)}분 뒤에 다시 시도하세요`,canGoBack:true});
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
        successRedirect:'/login/loginCallback',
        failureRedirect:'/error.html', 
        failureFlash:false,
    })
);

loginRouter.get('/google/callback',passport.authenticate('google', {
        successRedirect:'/login/loginCallback',
        failureRedirect: '/error.html',
        failureFlash:false,
    })
);

loginRouter.get('/loginCallback',async (request,response)=>{
    let identifier = request.user.email;
    try {
        let authResult = await sequelize.models.employee.findOne({where:{email:identifier}});
        if(authResult != null){
            if(authResult.grade === 'admin' || authResult.grade === 'user'){
                if(authResult.grade === 'admin'){
                    request.session.auth = getAdminAuth();
                }else{
                    request.session.auth = getUserAuth();
                }
                                
                let getResult = await sequelize.models.user.findOne({where:{email:identifier}});
    
                if(getResult.dataValues.needChange){
                    response.render('login/pwchange.html',{email:request.user.email });
                }else{
                    response.redirect(authResult.grade === 'admin' ? '/admin/main':'/user/main');
                }

                return;
            }else{
                response.render('error.html');
                return;
            }
        }else{
            response.render('info.html',{message:'해당 계정은 가입되어있지 않습니다.',canGoBack:true});
            return;
        }
    } catch (error) {
        response.render('info.html',{message:'DB 오류',canGoBack:true});
    }
});

loginRouter.post('/passwordReset',async (request,response)=>{
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
});

loginRouter.post('/passwordResetSkip',(request,response)=>{
    if(checkUserAuth(request.session.auth)){
        response.render('/user/main');
    }else if(checkAdminAuth(request.session.auth)){
        response.redirect('/admin/main');
    }else{
        response.render('error.html');
    }
})

export default loginRouter;