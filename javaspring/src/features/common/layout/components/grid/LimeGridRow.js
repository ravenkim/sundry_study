import React from "react";

/**
 * 시간 : 2021-11-15
 * 작성자 : 김명훈
 *
 * @param rowNum 지정된 row 번호
 * @param children
 *
 **/
const LimeGridRow = ({
                        rowNum=1,
                      children
                  }) => {
    return (
            <div className={`row row${rowNum}`}>
                {children}
            </div>

    );
};

export default LimeGridRow;
