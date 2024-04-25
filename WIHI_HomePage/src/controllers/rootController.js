export const home = async (req, res) => {
    return res.render("home",{pageTitle: "Home"});
};

export const manager = async (req, res) => {
    return res.render("manager",{pageTitle: "manager"});
};


export const members = async (req, res) => {
    return res.render("members",{pageTitle: "Members"});
};


export const about = async (req, res) => {
    return res.render("about",{pageTitle: "About Us"});
};