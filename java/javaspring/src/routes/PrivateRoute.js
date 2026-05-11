import React, {useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route } from "react-router-dom";
import { goBack, push, replace } from "connected-react-router";
import { ROLE } from "Constants";
import { Modal } from "antd";

/**
 * 로그인한 회원만 접속 가능
 * @returns {JSX.Element}
 * @constructor
 */
const PrivateRoute = ({ component: Component, auth=[], ...rest }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(({ userReducer }) => ({
    user: userReducer.user.data,
  }));

  const authCheckHandler = (checkAuth) => {
    let isAuth = false;
    if (checkAuth && checkAuth.length>0) {
      if (user.groups.includes(ROLE.ROLE_ADMIN) || user.isAdmin) {
        isAuth = true;
      }else{
          user.groups.forEach((item)=>{
              if(checkAuth.includes(item)){
                isAuth = true;
              };
          })
      }

    } else {
      isAuth = true;
    }
    return isAuth;
  };

  useEffect(()=>{
      if(!user){
          dispatch(push("/login"));
      }
  },[user])

  return (
    <Route
      {...rest}
      render={(props) => {
        if (user) {
          if (authCheckHandler(auth)) {
            // 로그인 되었을때
            return <Component {...props} />;
          } else {
              if(props.history.action === "PUSH" || props.history.action ==="POP"){
                  Modal.error({
                      title: "페이지 접근권한이 없습니다.",
                      okText: "확인",
                      onOk: (close) => {
                          dispatch(goBack());
                          close();
                      },
                  });
              }
          }
        }
      }}
    />
  );
};

export default PrivateRoute;
