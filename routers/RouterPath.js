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
const VIDEO_DETAIL = "/detail";
const VIDEO_DETAIL_REQUEST = "/detail/:filename";
const VIDEO_EDIT = '/edit';
const VIDEO_EDIT_REQUEST = "/edit/:filename";
const DELETE_VIDEO = "/delete";

//아직
const SEARCH_VIDEO = "/:id/Search";

//파일 영역
const FILE_ROOT = "/File";
const GET_FILE = "/getfile";
const GET_AVATAR = '/getAvatar';

//사용자 영역
const USER_ROOT = "/user";
const ME = "/me";
const EDIT_PROFILE = "/edit-profile";
const CHANGE_PASSWORD = "/change-password";

const SEARCH = "/search";
const ABOUT = "/about";
const USERS = "/users";
const USER_DETAIL = "/:id";


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
      root: ROOT,
      all:ALL,
      me:ME,
      edit:EDIT_PROFILE
    },
    file:{
      origin:WORKING_ROOT + FILE_ROOT,
      root:ROOT,
      all:ALL,
      fileget:GET_FILE,
      avatarget:GET_AVATAR
    },
    video:{
      origin:WORKING_ROOT + VIDEO_ROOT,
      root: ROOT,
      all:ALL,
      upload:VIDEO_UPLOAD,
      detail:VIDEO_DETAIL,
      detailRequest:VIDEO_DETAIL_REQUEST,
      edit:VIDEO_EDIT,
      editRequest:VIDEO_EDIT_REQUEST,
      delete:DELETE_VIDEO,
      search:SEARCH_VIDEO
    }
  }
};