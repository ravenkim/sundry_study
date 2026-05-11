import React, { useEffect, useState } from "react";
import LimeButton from "features/common/button/components/LimeButton";

/**
 * 작성자 : 김명훈
 * 작성일자 : 21.11.11
 * 수정일자 : 21.11.17
 *
 * @param  children  자식 컴포넌트 비구조화 할당
 * @param frontTitle  메인타이틀
 * @param subTitle  서브타이틀
 * @param backTitle 서브타이틀 뒤에 붙는 Back 타이틀
 * @param extraContents 터아툴 뒤에 붙는 컨텐츠
 * @param closeState 열기/닫기 상태 값 조절 default : false, 지정값 : true/false
 * @param style 커스텀 스타일 적용
 * @param heightStyle content-detail 디테일 부분 height 스타일 설정. default: auto, 지정값 : none, auto, 100
 * @param addClassName 컴포넌트 내부의 최상위 클래스에 변동적인 클래스
 * @param buttonLabel 컴포넌트 버튼 라벨 텍스트 명칭
 * @param bottomButton 하단부분 버튼 추가시 사용 ※ content-button 클래스 사용시 호출
 * @param useDocSize docsize 조절 버튼 사용 유무
 * @param addDetailClassName detail div 내부 class 추가
 *
 * ---- 토픽 맵 관련 변수 ----
 * @param titleChildren 검색식 표출 위치 셋
 * @param titleLastChildren 토픽 드레그 노드용 위치 세팅용 변수
 *
 * ----  열기/닫기 버튼 대신 다른 요소들 구현 관련 변수 ----
 * @param useOpener 열기/닫기 사용
 * @param conTitleAddClass  con-title 내부에 추가적으로 들어가는 클래스 변수
 *        ※ 토픽 모델링 화면에서 사용을 위해 구현 되어있음 사용법 확인시 토픽 모델링 페이지 확인
 * @param replaceContent 추가 컨텐츠
 *
 * @returns LimeContentsWrap 서브 컨텐츠 Wrapper Component
 * @constructor
 */
const LimeContentsWrap = ({
  children,
  frontTitle,
  subTitle,
  backTitle,
  style,
  heightStyle = "auto",
  extraContents = null,
  closeState = false,
  useOpener = true,
  conTitleAddClass = "",
  replaceContent,
  addClassName = "",
  addDetailClassName = "",
  buttonLabel = "",
  useDocSize = false,
  bottomButton,
  titleChildren,
  titleLastChildren = "",
}) => {
  const [close, setClose] = useState(false);

  useEffect(() => {
    setClose(closeState);
  }, [closeState]);



  const clickHandler = () => {
    setClose((value) => !value);
    return false;
  };

  const makeTitleHandler = () => {
    let title = [];
    if (frontTitle && backTitle)
      title.push(
        <h3 key={"title"}>
          {frontTitle}
          {subTitle ? <span key={"sub_title"}>{subTitle}</span> : ""}
          {backTitle}
        </h3>
      );
    else if (frontTitle && !backTitle) {
      title.push(<h3 key={"title"}>{frontTitle}</h3>);
      if (subTitle) title.push(<span key={"sub_title"}>{subTitle}</span>);
    }




    return (
      <div className={`con-title ${conTitleAddClass}`}>
        {title}
        {replaceContent}
        {extraContents}
        {useOpener&&!replaceContent &&
        <a
          title={`${buttonLabel} ${close ? "열기" : "닫기"}`}
          className={close ? "btn-down" : "btn-up"}
          onClick={clickHandler}
        >
          <em className="hidden">
            `${buttonLabel} ${close ? "열기" : "닫기"}`
          </em>
        </a>
        }
      </div>
    );
  };

  return (
    <div  className={`con-box ${addClassName}`} style={{ ...style }}>
      {makeTitleHandler()}
      {titleChildren}
      <div
        className={`content-detail ${
          heightStyle === "none" ? "" : "height-" + heightStyle
        } ${close ? "display-none" : ""}  ${addDetailClassName}`}
      >
        {children}
      </div>
      {bottomButton && <div className={`content-button${useDocSize?"02":""}`}>{bottomButton}</div>}
      {titleLastChildren}
    </div>
  );
};

export default LimeContentsWrap;
