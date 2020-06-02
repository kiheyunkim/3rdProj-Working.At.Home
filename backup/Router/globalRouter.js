import express from "express";
import routes from "../routes";
import passport from "passport";

import {
  firstHome,
  home,
  getJoin,
  postJoin,
  getLogin,
  postLogin,
  logout,
  search,
  showMe,
  githubLogin,
  postGithubLogin,
  googleLogin,
  postGoogleLogin,
  facebookLogin,
  postFacebookLogin,
} from "../controllers/globalController";

import { OnlyPublic, OnlyPrivate, LoginFirst } from "../middlewares";

const globalRouter = express.Router();

globalRouter.get(routes.home, LoginFirst, home);
globalRouter.get(routes.first_home, firstHome);

globalRouter.get(routes.join, getJoin);
globalRouter.post(routes.join, OnlyPublic, postJoin, postLogin);

globalRouter.get(routes.login, OnlyPublic, getLogin);
globalRouter.post(routes.login, OnlyPublic, postLogin);

globalRouter.get(routes.logout, OnlyPrivate, logout);
globalRouter.get(routes.search, OnlyPrivate, search);

globalRouter.get(routes.me, showMe);

//Github 라우터
globalRouter.get(routes.github_login, githubLogin);
globalRouter.get(
  routes.github_callback,
  passport.authenticate("github", { failureRedirect: "/login" }),
  postGithubLogin
);

//Google 라우터
globalRouter.get(routes.google_login, googleLogin);


globalRouter.get(
  routes.google_callback,
  passport.authenticate("google", { failureRedirect: "/login" }),
  postGoogleLogin
);

//Facebook 라우터
globalRouter.get(routes.facebook_login, facebookLogin);
globalRouter.get(
  routes.facebook_callback,
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  postFacebookLogin
);

export default globalRouter;
