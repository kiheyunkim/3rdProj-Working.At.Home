import {checkBlackList, addBlackListCount} from './../Security/BlackList';

export const globalFirewall = (request,response,next)=>{
  console.log(request.session);
  if(checkBlackList(request.socket.remoteAddress) === -1){
    response.status(404).send('IP가 차단되었습니다. 관리자에게 문의하세요');
    //ToDO -> 오류 통보
    return;
  }

  if(request.session.remoteip === undefined){
    request.session.remoteip = request.socket.remoteAddress;
  }else{
    if(request.session.remoteip !== request.socket.remoteAddress){
        addBlackListCount(request.session.remoteip);
        request.logout();
        return;
    }
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