import express from 'express';
const videoRouter = express.Router();
videoRouter.get('*',(request, response, next)=>{
    if(request.session.passport === undefined){
        response.send('/');
        return;
    }else{
        next();
    }
});


export default videoRouter;