//Video 영역에서의 컨트롤 함수
import routes from "../routes";
import Video from "../models/Video";

export const getUpload = (req, res) => {
  res.render("Upload", { pageTitle: "UPLOAD" });
};

export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { path },
  } = req;

  const newVideo = await Video.create({
    fileUrl: path,
    title,
    description,
    creator: req.user.id,
  });

  req.user.videos.push(newVideo.id);
  // req.user.save();
  //res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id).populate("creator");
    res.render("VideoDetail", { pageTitle: video.title, video: video });
    console.log(video);
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
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
