import React, {useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import SSsearchInput from "../../common/components/input/SSsearchInput.jsx";
import {cmsAction} from "./cmsReducer.jsx";
import Carousel from "../../common/components/Card/Carousel.jsx";
import ContentsCard from "../../common/components/contents/ContentsCard.jsx";
import {push} from "redux-first-history";

const Board = () => {

    const dispatch = useDispatch()

    const {
        boardType,
        path,
        boardDetail
    } = useSelector(({cmsReducer, router}) => ({
            boardType: cmsReducer.boardList.data,
            path: router.location?.pathname,
            boardDetail: cmsReducer.boardDetail.data,
        }),
        shallowEqual
    )

    const [boardId, setBoardId] = useState(null)

    useEffect(() => {
        if (path) {
            // console.log('path', path) // path = /board/{boardId}
            const data = path.split('/')
            setBoardId(Number(data[2])) // {boardId}
        }
    }, [path]); // url 값 확인 -- doorCard로 넘겨준 id값 확인

    useEffect(() => {
        if (boardId) {
            dispatch(cmsAction.getBoardDetail(boardId))
        }
    }, [boardId]); // boardId로 detail 데이터 요청


    return (
        <div>
            <SSsearchInput
                title={`원하는 ${boardDetail?.boardInfo?.boardNm}를 빠르게 찾아보세요!`}
                placeholder={'검색어를 입력해주세요.'}
            ></SSsearchInput>

            {/*추천 컨텐츠*/}
            <Carousel title={"당신에게 추천할게요."}>
                {boardDetail?.contentInfoList?.map((item, idx) => (
                    <ContentsCard key={item.index} item={item} idx={idx} onClick={() => {
                        dispatch(push(`/content/${item?.contentId}`))
                    }}/>
                ))}
            </Carousel>

            {/*리스트 형식*/}

            {/*카드 형식*/}
        </div>
    );
};

export default Board;

/*
     {
         name : book,
         id: 1,
         layout: [
            title : {
                order: 1,

                useLabel: 'N'
                label: '게시판 이름',



                type: text_title, >> 이거에 따라서 컴포 넌트를 구현
                data: 대여 개시판',
                (dataType: text)

            },

            subTitle: {
                order: 2,


                useLabel: 'N'
                label: '게시판 설명',

                type: text_subtitle,
                value: 책을 대여할 수 있는 게시판 입니다
                attribute: text,
            },

            recommendBook: {
                label: '추천 도서',

                order: 3,
            },

            main: {
                name: 도서 목록
                order: 4

                data: {
                    .....
                    .....
                    ....
                    ....
                    ....
                    ....
                    ....
                    ....
                },
            }


         ],

     }
     */
