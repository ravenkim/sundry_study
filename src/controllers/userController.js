import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

//화원가입
export const getJoin = async (req, res) => {
    res.render("join", { pageTitle: "Join" });
}

export const postJoin = async (req, res) => {
    const {id, password, password2, username, email, location} = req.body;
    const pageTitle = "Join";
    if (password !== password2) {
        return res.status(400).render("join", {
          pageTitle,
          errorMessage: "Password confirmation does not match.",
        });
    }
    const exists = await User.exists({ $or: [{ id }, { email }] });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This ID or Email is already taken.",
    });
  }
  try {
    await User.create({
      id,
      password,
      username,
      email,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: error._message,
    });
  }
}


//로그인
export const getLogin = async (req, res) => {
    res.render("login", { pageTitle: "Login" });
  }

export const postLogin = async (req, res) => {
    const { id, password } = req.body;
    const pageTitle = "Login";
    console.log(id)
    const user = await User.findOne({ id });
    console.log(user)
    if (!user) {
        return res.status(400).render("login", {
          pageTitle,
          errorMessage: "This ID does not exists.",
        });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.status(400).render("login", {
          pageTitle,
          errorMessage: "Wrong password",
        });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
}



