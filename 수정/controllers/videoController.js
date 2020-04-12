//Video 영역에서의 컨트롤 함수
import routes from "../routers/RouterPath";
import Video from "../models/Video";
import multer from "multer";
import sequelize from "../models";
import fs from 'fs';
const path = process.cwd()+'\\uploads\\videos\\';
const multerVideo = multer({ dest: "uploads/videos/" });

export const uploadVideo = multerVideo.single("videoFile");

export const videoFireWall = (request, response, next)=>{
  next();
}

export const getVideoHome = async (request,response)=>{
  let videos = await sequelize.models.video.findAndCountAll({where:{email:request.user.email}})
  let count = videos.count;
  let items = [];

  for(let i=0;i<count;++i){
    items.push({title:videos.rows[i].dataValues.titlem, views:0, fileUrl:videos.rows[i].dataValues.filename});
  }
  
  response.render('Home',{ pageTitle: "videoHome", videos:items});
}


export const videoDetail = async (request, response) => {
  const {
    params: { filename },
  } = request;

  let findResult = null;
  try {
    findResult = await sequelize.models.video.findOne({where:{email:request.user.email, filename:filename}});
  } catch (error) {
    response.render('Info',{pageTitle:'Error!', message:"오류가 발생했습니다.",infoType:'back'});
    return;
  }

  if(findResult !== null){
    let comments = [];
    let video = {fileName:findResult.filename,title:findResult.title,description:findResult.description,views:0, comments:comments}; 
    response.render("VideoDetail", { pageTitle: findResult.title, video });
  }else{
    response.render('Info',{pageTitle:'Error!', message:"잘못된 접근입니다.",infoType:'back'});
  }
};


export const getUpload = (request, response) => {
  response.render("Upload", { pageTitle: "UPLOAD" });
};

export const postUpload = async (request, response) => {
  const {
    body: { title, description },
    file: { path,filename }
  } = request;

  await sequelize.models.video.create({email:request.user.email,filename:filename,path:path,date:new Date(),title:title,description:description});

  response.redirect(routes.working.video.origin + routes.working.root);
};


export const getEditVideo = async (request, response) => {
  const {
    params: { filename },
  } = request;
  
  let result = null;
  try {
    result = await sequelize.models.video.findOne({where:{email:request.user.email, filename:filename}});
  } catch (error) {
    console.log(error);
    response.render('Info',{pageTitle:'Error!', message:"DB 오류",infoType:'back'});
    return;
  }
  
  if(result === null){
    response.render('Info',{pageTitle:'Error!', message:"잘못된 접근입니다.",infoType:'back'});
    return;
  }
  
  if(request.user.videoTask !== undefined){
    delete request.user.videoTask;
  }
  request.user.videoTask = filename;

  let video = {fileName:result.filename,title:result.title,description:result.description,views:0, comments:[]}; 
  response.render("EditVideo", { pageTitle: `편집 ${result.title}`, video }); 
};

export const postEditVideo = async (request, response) => {
  const {
    body: { title, description },
  } = request;
  let taskTitle = request.user.videoTask;
  let result = 0;
  if(request.user.videoTask === undefined){
    response.render('Info',{pageTitle:'Error!', message:"잘못된 접근입니다.",infoType:'back'});
    return;
  }

  try {
    result = await sequelize.models.video.count({email:request.user.email,filename:taskTitle});
  } catch (error) {
    console.log(error);
    response.render('Info',{pageTitle:'Error!', message:"DB 오류",infoType:'back'});
    return;
  }
  
  if(result !== 1){
    response.render('Info',{pageTitle:'Error!', message:"잘못된 접근입니다.",infoType:'back'});
    return;
  }

  try {
    await sequelize.models.video.update({title:title,description:description},{where:{email:request.user.email,filename:taskTitle}});
  } catch (error) {
    response.render('Info',{pageTitle:'Error!', message:"DB 오류",infoType:'back'});
    return;
  }

  delete request.user.videoTask;
  response.redirect(routes.working.video.origin + routes.working.video.detail + "/" +taskTitle);
};

export const deleteVideo = async (request, response) => {
  if(request.user.videoTask === undefined){
    response.render('Info',{pageTitle:'Error!', message:"잘못된 접근입니다.",infoType:'back'});
    return;
  }
  let taskTitle = request.user.videoTask;
  let result = 0;

  try {
    result = await sequelize.models.video.count({email:request.user.email,filename:taskTitle});
  } catch (error) {
    console.log(error);
    response.render('Info',{pageTitle:'Error!', message:"DB 오류",infoType:'back'});
    return;
  }
  
  if(result !== 1){
    response.render('Info',{pageTitle:'Error!', message:"잘못된 접근입니다.",infoType:'back'});
    return;
  }

  let transaction = null;
  try {
    transaction = await sequelize.transaction();
    fs.unlinkSync(path + taskTitle);
    await sequelize.models.video.destroy({where:{filename:taskTitle}},{transaction});
  } catch (error) {
    console.log(error);
    transaction.rollback();
    response.render('Info',{pageTitle:'Error!', message:"DB오류",infoType:'back'});
    return;
  }

  transaction.commit();
  response.redirect(routes.global.root);
};


export const search = async (req, res) => {
  const {
    query: { term: search_target }
  } = req; // const search_target=req.query.term
  let videos = [];
  try {
    videos = await Video.find({
      title: { $regex: search_target, $options: "i" }
    });
  } catch (error) {
    console.log(error);
  }

  res.render("Search", {
    pageTitle: "SEARCH",
    searchingBy: search_target,
    videos
  });
};
