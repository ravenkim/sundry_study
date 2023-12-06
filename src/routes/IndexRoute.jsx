import {Route, Routes} from "react-router-dom";
import LoginPage from "../pages/accounts/LoginPage.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import DoorPage from "../pages/door/DoorPage.jsx";


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
                path="/door"
                element={
                    <PrivateRoute>
                        <DoorPage></DoorPage>
                    </PrivateRoute>
                }
            />
        </Routes>
    )
}

export default IndexRoute;
