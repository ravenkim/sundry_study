import React from 'react';
import {goBack, push} from "connected-react-router";
import {Modal} from "antd";
import {Route} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {ROLE} from "Constants";

const AdminRoute = ({ component: Component, auth, ...rest }) => {

    const dispatch = useDispatch();
    const { user } = useSelector(({ userReducer }) => ({
        user: userReducer.user.data,
    }));

    const adminAuthCheckHandler = (checkAuth) => {
        let isAuth = false;
        if (checkAuth) {
            if (user.groups.includes(ROLE.ROLE_ADMIN) || user.isAdmin) {
                isAuth = true;
            }

        } else {
            isAuth = true;
        }
        return isAuth;
    };

    return (
            <Route
                    {...rest}
                    render={(props) => {
                        if (!user) {
                            return dispatch(push("/login"));
                        } else {
                            if (adminAuthCheckHandler(auth)) {
                                // 로그인 되었을때
                                return <Component {...props} />;
                            } else {
                                Modal.error({
                                    title: "관리자 권한이 없습니다.",
                                    okText: "확인",
                                    onOk: (close) => {
                                        dispatch(goBack());
                                        close();
                                    },
                                });
                            }
                        }
                    }}
            />
    );
};

export default AdminRoute;