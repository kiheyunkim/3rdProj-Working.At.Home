import routes from "./routers/RouterPath";
import multer from "multer";

const multerVideo = multer({ dest: "uploads/videos/" });

const multerAvatar = multer({ dest: "uploads/avatar/" });

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "Working at Home";
  res.locals.routes = routes;
  res.locals.loggedUser = req.user || null;

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

export const uploadVideo = multerVideo.single("videoFile");

export const uploadAvatar = multerAvatar.single("avatar");
