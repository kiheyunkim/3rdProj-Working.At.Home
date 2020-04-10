//공통
const ROOT = "/";
const ALL = "*";
//Global한 영역
const GLOBAL_ROOT = ROOT;
const FIRST_HOME = "/first_home";
const LOGOUT = "/logout";
const GITHUB_CALLBACK = "/callback/github";
const GOOGLE_CALLBACK = "/callback/google";
const FACEBOOK_CALLBACK = "/callback/facebook";
const KAKAO_CALLBACK = "/callback/kakao";
const POST_CALLBACK = "/postCallback";
const ERROR = '/error';

//로그인 영역
const LOGIN_ROOT = "/login"

//ACCOUNT 영역
const ACCOUNT_ROOT = "/account";
const LOGIN = "/login";
const JOIN = "/join";
const PASSWORD_RESET ="/passwordReset";
const GITHUB_LOGIN = "/auth/github"; //Github 영역
const GOOGLE_LOGIN = "/auth/google";//Google 영역
const FACEBOOK_LOGIN = "/auth/facebook";//Facebook 영역

//ACCOUNTAUTH(가칭)영역
const ACCOUNT_AUTH_ROOT = "/accountAuth";
//Local
const LOCAL_ACCOUNT_AUTH_ROOT = '/local';
const LOCAL_ACCOUNT_AUTH = '/localAuth';
//SNS
const SNS_ACCOUNT_AUTH_ROOT = '/sns';
const SOCIAL_JOIN = "/socialJoin";
const QUESTION = "/question";

//WORKING영역
const WORKING_ROOT = "/working";
//비디오 영역
const VIDEO_ROOT = '/video';
const VIDEO_UPLOAD = '/upload';
const VIDEO_DETAIL = "/:id";
const EDIT_VIDEO = "/:id/edit-video";
const DELETE_VIDEO = "/:id/delete";
const SEARCH_VIDEO = "/:id/Search";


//사용자 영역
const USER_ROOT = "/user";

const SEARCH = "/search";
const ABOUT = "/about";
const USERS = "/users";
const USER_DETAIL = "/:id";
const EDIT_PROFILE = "/edit-profile";
const CHANGE_PASSWORD = "/change-password";
const ME = "/me";


export default {
  global:{
    origin:ROOT,
    root: ROOT,
    all:ALL,
    first_home: FIRST_HOME,
    passportCallback: {
      github:GITHUB_CALLBACK,
      google:GOOGLE_CALLBACK,
      facebook:FACEBOOK_CALLBACK,
      kakao:KAKAO_CALLBACK,
      postCallBack:POST_CALLBACK
    },
    logout:LOGOUT,
    error:ERROR
  },
  login:{
    origin:LOGIN_ROOT,
    root: ROOT,
    all:ALL,
    account:{
      origin:LOGIN_ROOT+ACCOUNT_ROOT,
      root: ROOT,
      all:ALL,
      login:LOGIN,
      join:JOIN,
      reset:PASSWORD_RESET,
      social:{
        github:GITHUB_LOGIN,
        google:GOOGLE_LOGIN,
        facebook:FACEBOOK_LOGIN
      }
    },
    accountAuth:{
      origin:LOGIN_ROOT+ACCOUNT_AUTH_ROOT,
      root: ROOT,
      all:ALL,
      local:{
        origin:LOGIN_ROOT + ACCOUNT_AUTH_ROOT + LOCAL_ACCOUNT_AUTH_ROOT,
        root: ROOT,
        all:ALL,
        accountAuth:LOCAL_ACCOUNT_AUTH
      },
      sns:{
        origin:LOGIN_ROOT + ACCOUNT_AUTH_ROOT + SNS_ACCOUNT_AUTH_ROOT,
        root: ROOT,
        all:ALL,
        socialJoin:SOCIAL_JOIN,
        question:QUESTION
      }
    }
  },
  working:{
    origin:WORKING_ROOT,
    root: ROOT,
    all:ALL,
    user:{
      origin:WORKING_ROOT + USER_ROOT,
      root: USER_ROOT,
      all:ALL,
      
    },
    video:{
      origin:WORKING_ROOT + VIDEO_ROOT,
      root: ROOT,
      all:ALL,
      upload:VIDEO_UPLOAD,
      detail:VIDEO_DETAIL,
      edit:EDIT_VIDEO,
      delete:DELETE_VIDEO,
      search:SEARCH_VIDEO
    }
  }
/*
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
  */
};