
//화원가입
export const getJoin = async (req, res) => {
    res.render("join", { pageTitle: "Join" });
}


//로그인
export const getLogin = async (req, res) => {
    res.render("login", { pageTitle: "Login" });
  }

