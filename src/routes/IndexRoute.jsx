import {Route, Routes} from "react-router-dom";
import LoginPage from "src/pages/accounts/LoginPage.jsx";
import PrivateRoute from "src/routes/PrivateRoute.jsx";
import DoorPage from "src/pages/door/DoorPage.jsx";
import IndexPage from "src/pages/index/IndexPage.jsx";
import ErrorPage from "src/pages/error/ErrorPage.jsx";
import AdminPage from "src/pages/admin/AdminPage.jsx";
import ContentPage from "src/pages/cms/ContentPage.jsx";
import BoardPage from "src/pages/cms/BoardPage.jsx";
import ProfilePage from "src/pages/accounts/ProfilePage.jsx";
import CmsPage from "src/pages/cms/CmsPage.jsx";


const IndexRoute = () => {
    return (
        <Routes
        >

            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <IndexPage/>
                    </PrivateRoute>
                }
            />

            <Route
                path=""
                element={<div>zzzzzz</div>}
                exact
            />
            <Route
                path="/login"
                element={<LoginPage/>}
                exact
            />

            <Route
                path="/door"
                element={
                    <PrivateRoute>
                        <DoorPage></DoorPage>
                    </PrivateRoute>
                }
            />

            <Route
                path="/profile"
                element={
                    <PrivateRoute>
                        <ProfilePage></ProfilePage>
                    </PrivateRoute>
                }
            />


            <Route
                path="/admin"
                element={
                    <PrivateRoute>
                        <AdminPage/>
                    </PrivateRoute>
                }
            />


            <Route
                path="/content/:content"
                element={
                    <PrivateRoute>
                        <CmsPage/>
                    </PrivateRoute>
                }
            />

            {/*임시 보드 페이지*/}
            <Route
                path="/board/:board/"
                element={
                    <PrivateRoute>
                        <CmsPage />
                    </PrivateRoute>
                }
            />


            <Route
                path="*"
                element={<ErrorPage/>}
            />
        </Routes>
    )
}

export default IndexRoute;
