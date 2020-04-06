//User 영역에서의 컨트롤러 함수
import routes from "../routes";
import User from "../models/User";

export const userFirewall = (request, response, next)=>{
  next();
}

export const showMe = (req, res) => {
  res.render("UserDetail", { pageTitle: "User Detail", user: req.user });
};

export const getEditProfile = (req, res) => {
  res.render("EditProfile", { pageTitle: "EDIT_PROFILE" });
};

export const postEditProfile = async (req, res) => {
  const {
    body: { name, email },
    file,
  } = req;

  try {
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: file ? file.path : req.user.avatarUrl,
    });
    res.redirect(routes.me);
  } catch (error) {
    res.redirect(routes.editProfile, { pageTitle: "Edit Profile" });
  }
};

export const getChangePassword = (req, res) => {
  res.render("ChangePassword", { pageTitle: "CHANGE_PASSWORD" });
};

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword1 },
  } = req;

  try {
    if (newPassword !== newPassword1) {
      res.status(400);
      res.redirect(`/users/${routes.changePassword}`);
      return;
    }
    await req.user.changePassword(oldPassword, newPassword);
    res.redirect(`/users/${routes.me}`);
  } catch (error) {
    res.redirect(`/users/${routes.changePassword}`);
  }
};

export const userDetail = async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    const user = await User.findById(id);
    res.render("UserDetail", { pageTitle: "USER_DETAIL", user });
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ _id: -1 });
    //console.log(videos);

    res.render("Home", { pageTitle: "HOME", videos });
  } catch (error) {
    res.render("Home", { pageTitle: "HOME", videos: [] });
  }
};