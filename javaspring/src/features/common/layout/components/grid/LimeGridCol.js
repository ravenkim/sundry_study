import React from "react";

/**
 * 시간 : 2021-11-15
 * 작성자 : 김명훈
 *
 * @param colType col 타입 지정 left/right
 * @param addClassName 최상위 컨테이너에 추가적인 클래스들
 * @param children
 *
 **/
const LimeGridCol = ({
                         colType = 'left',
                         addClassName='',
                         children
                     }) => {
    return (
            <article className={`col-${colType} ${addClassName}`}>
                {children}
            </article>
    );
};

export default LimeGridCol;
