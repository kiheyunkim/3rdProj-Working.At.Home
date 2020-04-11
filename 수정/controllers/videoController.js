//Video 영역에서의 컨트롤 함수
import routes from "../routers/RouterPath";
import Video from "../models/Video";
import multer from "multer";
import sequelize from "../models";

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
    params: { video },
  } = request;

  let findResult = null;
  try {
    findResult = await equelize.models.video.findOne({where:{email:request.user.email, filename:video}});
  } catch (error) {
    console.log(error);
  }

  if(findResult !== null){ 
    response.render("VideoDetail", { pageTitle: findResult.title, video: video });
  }else{
    response.redirect(routes.global.root);
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


export const getEditVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    if (String(video.creator) !== req.user.id) {
      throw Error();
    } else {
      res.render("EditVideo", { pageTitle: `편집 ${video.title}`, video });
    }
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description },
  } = req;
  try {
    await Video.findOneAndUpdate({ _id: id }, { title, description });
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    if (String(video.creator) !== req.user.id) {
      throw Error();
    } else {
      await Video.findOneAndRemove({ _id: id });
    }
  } catch (error) {
    console.log(error);
  }
  res.redirect(routes.home);
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
