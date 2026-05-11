import React, { useState, useEffect } from "react";

/**
 * 라임서브버튼
 *  @param title: 용도 [수정, 고정, 닫기, 열기]
 *  .search-history li div | .con-title
 * */
const LimeSubButton = ({ title, style, visible }) => {
  const [type, setType] = useState();
  useEffect(() => {
    switch (title) {
      case "수정":
        setType("btn btn-remove");
        break;
      case "고정":
        setType("btn-thumbtack");
        break;
      case "닫기":
        setType("btn-up");
        break;
      case "열기":
        setType("btn-down");
        break;
      case "새로고침":
        setType("btn-sync");
        break;
    }
  }, [title]);

  return (
    <a className={type} style={style} disabled={visible}>
      {title === "수정" ? title : <em className="hidden">{title}</em>}
    </a>
  );
};

export default LimeSubButton;
