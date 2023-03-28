import React from "react"
import { Route, Routes, } from "react-router-dom";
import ErrorPage from "../pages/error/ErrorPage"
import Home from "../pages/home/Home";


const IndexRoute = () => {
    return (
        <Routes>
            <Route path={"/"} element={<Home />} />
            <Route path={"*"} element={<ErrorPage />} />
        </Routes>
    )
}


export default IndexRoute
