import React from "react";

const LimeFooter = () => {
  const openClauseViewPopup = ({ clusSe }) => {
    window.open(
      window.location.protocol +
        "//" +
        window.location.hostname +
        ":" +
        window.location.port +
        "/clause/" +
        clusSe,
      "LIME_CLAUSE_WINDOW",
      "width=800,height=800,directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no"
    );
  };

  return (
    <div className="footerwrap">
      <h2 className="skip">footer</h2>
      <ul>
        <li>
          <a onClick={() => openClauseViewPopup({ clusSe: "CL008001000" })}>
            이용약관
          </a>
        </li>
        <li>
          <a onClick={() => openClauseViewPopup({ clusSe: "CL008002000" })}>
            개인정보처리방침
          </a>
        </li>
      </ul>
      <p className="copyright">
        Copyright (C). 2021 유클리드소프트(주) All Rights Reserved.
      </p>
    </div>
  );
};

export default LimeFooter;
