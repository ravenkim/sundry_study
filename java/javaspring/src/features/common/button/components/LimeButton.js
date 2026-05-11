import React from "react";

/**
 * 라임버튼
 *  @param title: 버튼 텍스트
 *  @param iconTitle : 아이콘 태그 title
 *  @param icon : 아이콘 태그 사용 시
 *  @param classType: [primary, secondary, tertiary]
 *  @param value: 값
 *  @param size: [32, 40, 48]
 * */
const LimeButton = (
  {
      title,
      classType="primary",
      size="40",
      value,
      style,
      disabled=false,
      visible=true,
      onClick,
      addClass
  }) => {
    return (
        <button
            className={`btn-${classType}-${size === "sm" ? "32" :(size === "lg" ? "48" : "40")}`+`${addClass}`}
            type={"button"}
            onClick={onClick}
            style={style}
            disabled={disabled}
            value={value}
            visible={visible}
            >
          {title}
        </button>
    )
}

export default LimeButton;
