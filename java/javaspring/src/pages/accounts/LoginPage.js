import React from "react";
import LimeLayout from "features/common/layout/components/LimeLayout";
import { Button, Checkbox, Form, Input, Spin } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import LoginForm from "features/accounts/components/form/LoginForm";
import {Helmet} from "react-helmet";

const LoginPage = () => {
  return (
    <>
      <Helmet title={"로그인-TIPA"}/>
        <LoginForm />
    </>

  );
};

export default LoginPage;
