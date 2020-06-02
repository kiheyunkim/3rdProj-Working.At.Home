//Global한 영역
const FIRST_HOME = "/first_home";
const HOME = "/";
const JOIN = "/join";
const LOGIN = "/login";
const LOGOUT = "/logout";
const SEARCH = "/search";
const ABOUT = "/about";

//사용자 영역
const USERS = "/users";
const USER_DETAIL = "/:id";
const EDIT_PROFILE = "/edit-profile";
const CHANGE_PASSWORD = "/change-password";
const ME = "/me";

//비디오 영역
const VIDEOS = "/videos";
const UPLOAD = "/upload";
const VIDEO_DETAIL = "/:id";
const EDIT_VIDEO = "/:id/edit-video";
const DELETE_VIDEO = "/:id/delete";

//Github 영역
const GITHUB_LOGIN = "/auth/github";
const GITHUB_CALLBACK = "/auth/github/callback";

//Google 영역
const GOOGLE_LOGIN = "/auth/goolge";
const GOOGLE_CALLBACK = "/auth/google/callback";

//Facebook 영역
const FACEBOOK_LOGIN = "/auth/facebook";
const FACEBOOK_CALLBACK = "/auth/facebook/callback";

const routes = {
  first_home: FIRST_HOME,
  home: HOME,
  join: JOIN,
  login: LOGIN,
  logout: LOGOUT,
  search: SEARCH,
  users: USERS,
  userDetail: (id) => {
    if (id) {
      return `/users/${id}`;
    } else {
      return USER_DETAIL;
    }
  },
  editProfile: EDIT_PROFILE,
  changePassword: CHANGE_PASSWORD,
  me: ME,

  videos: VIDEOS,
  upload: UPLOAD,
  videoDetail: (id) => {
    if (id) {
      return `/videos/${id}`;
    } else {
      return VIDEO_DETAIL;
    }
  },
  editVideo: (id) => {
    if (id) {
      return `/videos/${id}/edit-video`;
    } else {
      return EDIT_VIDEO;
    }
  },
  deleteVideo: (id) => {
    if (id) {
      return `/videos/${id}/delete`;
    } else {
      return DELETE_VIDEO;
    }
  },

  github_login: GITHUB_LOGIN,
  github_callback: GITHUB_CALLBACK,

  google_login: GOOGLE_LOGIN,
  google_callback: GOOGLE_CALLBACK,

  facebook_login: FACEBOOK_LOGIN,
  facebook_callback: FACEBOOK_CALLBACK,
};

export default routes;