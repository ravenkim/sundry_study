import React from "react"
import { Route, Routes, } from "react-router-dom";
import Aboutme from "../pages/aboutme/aboutme";
import Career from "../pages/career/career";
import Connect from "../pages/connect/connect";
import ErrorPage from "../pages/error/ErrorPage"
import Home from "../pages/home/Home";
import Profile from "../pages/profile/profile";
import Project from "../pages/project/Project";


const IndexRoute = () => {
    return (
        <Routes>
            <Route path={"/"} element={<Home />} />
            <Route path={"/profile"} element={<Profile />} />
            <Route path={"/career"} element={<Career />} />
            <Route path={"/aboutme"} element={<Aboutme />} />
            <Route path={"/project"} element={<Project />} />
            <Route path={"/connect"} element={<Connect />} />

            <Route path={"*"} element={<ErrorPage />} />
        </Routes>
    )
}


export default IndexRoute
