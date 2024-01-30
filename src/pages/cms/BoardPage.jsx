import React from 'react';
import SSlayout from "src/common/components/layout/SSlayout.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Board from "src/features/cms/board/Board.jsx";


const BoardPage = () => {


    return (
        <SSlayout>

                <Board/>
        </SSlayout>
    );
};

export default BoardPage;
