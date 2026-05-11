import {Route, Routes} from "react-router-dom";
import HomePage from "src/pages/home/HomePage.jsx";
import Test from "src/pages/test/Test.jsx";
import PicPage from "src/pages/home/PicPages.jsx";
import Loading from "src/pages/home/Loading.jsx";

const IndexRoute = () => {
    return (
        <Routes>
            <Route
              path="/"
              element={<HomePage/>}
            />

            <Route
              path="/ld"
              element={<Loading/>}
            />

            <Route
              path="/pic"
              element={<PicPage/>}
            />

        </Routes>
    )
}

export default IndexRoute;
