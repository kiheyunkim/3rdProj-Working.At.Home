import routes from "../routers/RouterPath";
import sequelize from './../models/index';
import randomStringGenerator from './../Security/RandomStringGenerator';
import sha256 from 'sha256';
const path = process.cwd()+'\\uploads\\avatar\\';

export const userFirewall = (request, response, next)=>{
  next();
}

export const showMe = async (request, response) => {
  let accountType = request.user.type;
  let url = null;
  if(accountType === 'local'){
    let avatarResult = await sequelize.models.localAvatar.findOne({where:{email:request.user.email}});
    url = routes.working.file.origin + routes.working.file.avatarget + '/?fileName=' + avatarResult.filename;
  }else{
    url = request.user.picture;
  }

  response.render("UserDetail", { pageTitle: "User Detail", user: {email:request.user.email, avatarUrl:url}});
};

export const getEditProfile = async (request, response) => {
  let findResult = await sequelize.models.employee.findOne({where:{email:request.user.email}});
  response.render("EditProfile", { pageTitle: "EDIT_PROFILE", user:{email: request.user.email, name:findResult.name, type:request.user.type}});
};

export const postEditProfile = async (request, response) => {

  let path = undefined;
  let filename = undefined;
  if(request.file !== undefined){
    path = request.file.path;
    filename = request.file.filename;
  }
  
  const {
    body:{oldPassword, newPassword, newPassword1}
  } = request

  if(filename !== undefined && path !== undefined && request.user.type !== 'local'){
    response.render('Info',{pageTitle:'Error!', message:"잘못된 접근입니다.", infoType:'back'});
    return;
  }

  let find = null;
  try {
    find = await sequelize.models.user.findOne({where:{email:request.user.email}});
  } catch (error) {
    response.render('Info',{pageTitle:'Error!', message:"DB오류", infoType:'back'});
  }

  if(find === null){
    response.render('Info',{pageTitle:'Error!', message:"잘못된 접근입니다.", infoType:'back'});
    return;
  }

  let salt = find.salt;
  let passwd = find.passwd

  if(passwd !== sha256(oldPassword + salt)){
    response.render('Info',{pageTitle:'Error!', message:"잘못된 비밀번호입니다.", infoType:'back'});
    return;
  }

  if(newPassword !== undefined || newPassword1 !== undefined){  //빈칸은 정규식이 확인
    if(newPassword !== newPassword1){
      response.render('Info',{pageTitle:'Error!', message:"바꾸려는 비밀번호가 일치하지 않습니다.", infoType:'back'});
      return;
    }
  }

  let transaction = null;
  try {
    transaction = await sequelize.transaction();

    if(filename!=undefined && path !== undefined){
      await sequelize.models.localAvatar.update({filename:filename, path :path},{where:{email:request.user.email}},{transaction});
    }
    fs.unlinkSync(path + taskTitle);
    if(newPassword !== '' && newPassword1 !== ''){
      let newSalt = sha256(randomStringGenerator(Math.random()*40 + 10));
      let newPasswd = sha256(newPassword + newSalt);
      await sequelize.models.user.update({passwd:newPasswd,salt:newSalt},{where:{email:request.user.email}}, {transaction});
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    response.render('Info',{pageTitle:'Error!', message:"DB 오류", infoType:'back'});
    return;
  }

  response.redirect(routes.working.user.origin + routes.working.user.me);
};

/*
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
    res.render("Home", { pageTitle: "HOME", videos });
  } catch (error) {
    res.render("Home", { pageTitle: "HOME", videos: [] });
  }
};
*/