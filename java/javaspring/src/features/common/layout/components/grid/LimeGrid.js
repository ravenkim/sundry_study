import React from "react";

/**
 * 작성자 : 김명훈
 * 작성일자 : 21.11.15
 *
 * @param keyword 해당 컨텐츠 그리드가 사용되는 컨텐트 키워드
 * @param sectionNum 섹션 class Number 지정 default : 2
 * @param children 내부 콘탠츠
 *
 * @returns {JSX.Element}
 * @constructor
 */
const LimeGrid = ({ keyword="컨텐츠 키워드",
                    sectionNum=2,
                        children
}) => {
  return (
          <section className={`section${sectionNum} container`}>
            <h2 className="hidden">{keyword}</h2>
              {children}
          </section>
  );
};

export default LimeGrid;
