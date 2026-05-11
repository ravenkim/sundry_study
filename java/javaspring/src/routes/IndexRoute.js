import React from "react";
import {Route, Switch} from "react-router-dom";

import ManageCodePage from "../pages/admin/ManageCodePage";
import ManageMenuPage from "../pages/admin/ManageMenuPage";
import ManageTermPage from "../pages/admin/ManageTermPage";
import ManageMemberPage from "../pages/admin/ManageMemberPage";
import ManageCondPage from "../pages/admin/ManageCondPage"
import LoginPage from "pages/accounts/LoginPage";
import PrivateRoute from "routes/PrivateRoute";
import ErrorPage from "pages/error/ErrorPage";

import {ROLE} from "Constants";
import PerfPage from 'pages/perf/PerfPage'
import EvaluatorPage from "pages/evaluator/EvaluatorPage";
import SamplePage from 'pages/sample/SamplePage'
import PreEvalPage from "pages/pre/PreEvalPage";
import ManagePerfPage from "../pages/admin/ManagePerfPage";
import ManageStatPage from "../pages/admin/ManageStatPage";
import PreEvalApplPage from "pages/pre/PreEvalApplPage";
import MyProfilePage from "pages/accounts/MyProfilePage";
import {useSelector} from "react-redux";

const IndexRoute = () => {
        const { user } = useSelector(({ userReducer }) => ({
                user: userReducer.user.data,
        }));

        return (
        <Switch>
            <Route
                path={["/index", "/main", "/"]}
                exact
                render={({history, location}) => {
                        let redirectPathname = "evaluator";
                        if(user && user.groups.includes(ROLE.ROLE_CHARGER)){
                                redirectPathname = "/pre/appl";
                        }
                    history.replace({
                        pathname: redirectPathname,
                        // state: {
                        //   searchType: SEARCH_TYPE.KEYWORD,
                        // },
                    });
                }}
            />
            <PrivateRoute component={EvaluatorPage} path={"/evaluator"} auth={[ROLE.ROLE_EXPERT, ROLE.ROLE_ADMIN]} exact/>
            <PrivateRoute component={PreEvalApplPage} path={"/pre/appl"} auth={[ROLE.ROLE_CHARGER,ROLE.ROLE_EXPERT, ROLE.ROLE_ADMIN]} exact/>
            <PrivateRoute component={PreEvalPage} path={"/pre/anal"} auth={[ROLE.ROLE_CHARGER,ROLE.ROLE_EXPERT, ROLE.ROLE_ADMIN]} exact/>

            <PrivateRoute
                component={PerfPage}
                auth={[ROLE.ROLE_EXPERT, ROLE.ROLE_ADMIN]}
                path={"/perf"}
                exact
            />

            {/*관리자 Route (추후 AdminRoute로 변경예정)  */}
            <PrivateRoute
                component={ManageCodePage}
                path={"/admin/code"}
                auth={[ROLE.ROLE_ADMIN]}
                exact
            />
            <PrivateRoute component={ManageMenuPage} auth={[ROLE.ROLE_ADMIN]} path={"/admin/menu"} exact/>
            <PrivateRoute component={ManageTermPage} auth={[ROLE.ROLE_ADMIN]} path={"/admin/term"} exact/>
            <PrivateRoute component={ManageMemberPage} auth={[ROLE.ROLE_ADMIN]} path={"/admin/member"} exact/>
            <PrivateRoute component={ManageCondPage} auth={[ROLE.ROLE_ADMIN]} path={"/admin/cond"} exact/>
            <PrivateRoute component={ManagePerfPage} auth={[ROLE.ROLE_ADMIN]} path={"/admin/perf"} exact/>
            <PrivateRoute component={ManageStatPage} auth={[ROLE.ROLE_ADMIN]} path={"/admin/stat"} exact/>

            <Route component={LoginPage} path={"/login"} exact/>
            <PrivateRoute component={MyProfilePage} path={"/profile"} exact/>
            <Route component={SamplePage} path={"/sample"} exact/>
            <Route component={ErrorPage} path={"*"}/>
        </Switch>
    );
};

export default IndexRoute;
