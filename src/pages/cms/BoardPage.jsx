import React from 'react';
import SSsectionWrap from "../../common/components/wrapper/SSsectionWrap.jsx";
import SSlayout from "../../common/components/layout/SSlayout.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Board from "../../features/cms/Board.jsx";


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
