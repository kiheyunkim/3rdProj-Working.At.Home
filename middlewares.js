import routes from "./routers/RouterPath";
import {checkAdminAuth, checkUserAuth} from './Security/IdentifierGenerator';

export const localsMiddleware = (request, response, next) => {
  response.locals.siteName = "Working at Home";
  response.locals.routes = routes;
  response.locals.loggedUser = request.user || null;

  if(checkAdminAuth(request.session.auth)){
    response.locals.auth = "admin";
  }else if(checkUserAuth(request.session.auth)){
    response.locals.auth = "user";
  }else{
    response.locals.auth = undefined;
  }
  
  next();
};

export const LoginFirst = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect(routes.first_home);
  }
};

export const OnlyPublic = (req, res, next) => {
  if (req.user) {
    res.redirect(routes.home);
  } else {
    next();
  }
};

export const OnlyPrivate = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect(routes.home);
  }
};



