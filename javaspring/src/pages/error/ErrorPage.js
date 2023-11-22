import React from "react";
import LimeButton from "features/common/button/components/LimeButton";

const ErrorPage = ({ history }) => {
  return (
    <div className="error-wrap">
      <div className="error">
        <h1>404 Error</h1>
        <p>
          죄송합니다.
          <br />웹 페이지를 찾을 수 없습니다. (HTTP 404)
        </p>
        <LimeButton
          onClick={() => history.goBack()}
          type={"button"}
          classType={"primary"}
          size={"md"}
          title={"이전 페이지로 돌아가기"}
        />
      </div>
    </div>
  );
};

export default ErrorPage;
