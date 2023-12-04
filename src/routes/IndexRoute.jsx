import {Route, Routes} from "react-router-dom";
import LoginPage from "../pages/accounts/LoginPage.jsx";
import PrivateRoute from "./PrivateRoute.jsx";


const IndexRoute = () => {
    return (
        <Routes>

            <Route
                path=""
                element={<div>zzzzzz</div>}
                exact
            />
            <Route
                path="/login"
                element={<LoginPage/>}
            />

            <Route
                path="/c"
                element={
                    <PrivateRoute>
                        <div>vvvv</div>
                    </PrivateRoute>
                }
            />
        </Routes>
    )
}

export default IndexRoute;
