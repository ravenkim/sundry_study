

export const home = async (req, res) => {
    return res.render("home",{pageTitle: "Home"});
};

export const watch = async (req, res) => {

};

export const getEdit = async (req, res) => {
    return res.render("edit", { pageTitle: "Edit Video" });
};

export const postEdit = async (req, res) => {

};

export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle: "Upload Video" });
}

export const search = async (req, res) => {
    return res.render("search", { pageTitle: "Search" });
}

export const deleteVideo = (req, res) => {
    return res.send("Delete Video");
  };