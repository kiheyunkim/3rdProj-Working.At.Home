//공통
const ROOT = "/";

//Global한 영역
const FIRST_HOME = "/first_home";
const JOIN = "/join";
const LOGIN = "/login";
const LOGOUT = "/logout";
const SEARCH = "/search";
const ABOUT = "/about";

//로그인 영역
const GITHUB_LOGIN = "/auth/github"; //Github 영역
const GITHUB_CALLBACK = "/auth/github/callback";
const GOOGLE_LOGIN = "/auth/goolge";//Google 영역
const GOOGLE_CALLBACK = "/auth/google/callback";
const FACEBOOK_LOGIN = "/auth/facebook";//Facebook 영역
const FACEBOOK_CALLBACK = "/auth/facebook/callback";


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

export default {
  global:{
      first_home: FIRST_HOME,
      root: ROOT,
      join: JOIN,
      search: SEARCH
  },
  login:{
    root: ROOT,
    local:{
      login: LOGIN,
    },
    github:{
      github_login: GITHUB_LOGIN,
      github_callback: GITHUB_CALLBACK
    },
    google:{
      google_login: GOOGLE_LOGIN,
      google_callback: GOOGLE_CALLBACK
    },
    facebook:{
      facebook_login: FACEBOOK_LOGIN,
      facebook_callback: FACEBOOK_CALLBACK,
    },
    logout: LOGOUT,
  },
  user:{
      root: ROOT,
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
      me: ME
  },
  vedio:{
      root: ROOT,
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
      }
  }
};