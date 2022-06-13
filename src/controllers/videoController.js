import Video from "../models/Video";
import User from "../models/User";


export const videos = async (req, res) => {
    const videos = await Video.find({}).sort({ createdAt: "desc" }).populate("owner");
    return res.render("videos", { pageTitle: "videos", videos });
}

export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id).populate("owner")
    if (!video) {
      return res.render("404", { pageTitle: "Video not found." });
    }
    return res.render("watch", { pageTitle: video.title, video });
  };

  
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { video, thumb } = req.files;
  
  const { title, description, hashtags } = req.body;
  const isHeroku = process.env.NODE_ENV === "production";
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: isHeroku ? video[0].location : video[0].path.replace(/[\\]/g, "/"),
      thumbUrl: isHeroku ? thumb[0].location : video[0].path.replace(/[\\]/g, "/"),
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    console.log("11");
    user.save();
    console.log("22");
    return res.redirect("/videos");
    console.log("33");
    console.log(error)
  } catch (error) {
    console.log(error);
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/videos");
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/videos");
};