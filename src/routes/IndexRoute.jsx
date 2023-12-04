import {Route, Routes} from "react-router-dom";
import LoginPage from "../pages/accounts/LoginPage.jsx";


const IndexRoute = () => {
    return (
        <Routes>
            <Route
              path=""
              element={<div>zzzzzz</div>}
            />
             <Route
              path="/login"
              element={<LoginPage/>}
            />
        </Routes>
    )
}

export default IndexRoute;
