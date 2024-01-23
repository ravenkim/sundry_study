import React from 'react';
import SSsectionWrap from "src/common/components/wrapper/SSsectionWrap.jsx";
import SSlayout from "src/common/components/layout/SSlayout.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Board from "src/features/cms/Board.jsx";


const BoardPage = () => {


    return (
        <SSlayout>
            <SSsectionWrap>
                <Board/>
            </SSsectionWrap>
        </SSlayout>
    );
};

export default BoardPage;
