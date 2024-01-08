import React, {useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import SSsearchInput from "../../common/components/input/SSsearchInput.jsx";
import {cmsAction} from "./cmsReducer.jsx";
import Carousel from "../../common/components/Card/Carousel.jsx";
import ContentsCard from "../../common/components/contents/ContentsCard.jsx";
import {push} from "redux-first-history";
import BoardSearchTable from "./components/BoardSearchTable.jsx";
import {profileAction} from "../profile/profileReducer.jsx";
import {Spin} from "antd";

const Board = () => {

    const dispatch = useDispatch()

    const {
        boardType,
        path,
        boardDetail,
        boardDetailLoading,
        searchResult,
    } = useSelector(({cmsReducer, router}) => ({
            boardType: cmsReducer.boardList.data,
            path: router.location?.pathname,
            boardDetail: cmsReducer.boardDetail.data,
            boardDetailLoading: cmsReducer.boardDetail.loading,
            searchResult: cmsReducer.boardSearchResult.data,
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

    useEffect(() => {
        return () => {
            dispatch(cmsAction.initializeAll())
            // 페이지 나가면 초기화
        }
    }, []);


    //////////////////////////////////////////////////////////////////////////////
    // infinite scroll

    const [fullList, setFullList] = useState([]) // 전체 리스트
    const [offset, setOffset] = useState(0) // back에 요청할 페이지 데이터 순서 정보
    // offset 이후 순서의 데이터부터 12개씩 데이터를 받아올 것
    const [target, setTarget] = useState(null) // 관찰대상 target
    const [isLoaded, setIsLoaded] = useState(false) // load 중인지 받아오기
    // 요청이 여러번 가는 것을 막기 위함
    const [stop, setStop] = useState(false) // 마지막 데이터까지 다 불러온 경우 더이상 요청을 보내지 않도록 설정

    // 카드 형식일 때만 인피니티 스크롤 적용
    useEffect(() => {
        let observer;

        if (target && !stop) {
            // callback 함수로 onIntersect를 지정
            observer = new IntersectionObserver(onIntersect, {
                threshold: 1, // 타겟이 100% 보였을 때 실행
            });
            observer.observe(target);
        }
        return () => observer && observer.disconnect();

    }, [target, isLoaded]);

    // isLoaded 관찰에 대한 상태가 변할 때 실행
    // get 요청 보내기
    useEffect(() => {
        if (isLoaded && !stop) {
            // 가져오는 데이터가 초기에 한번에 들어오기 때문에 한번에 들어오는 게 12개 보다 크면 잘라내기
            const batchSize = boardDetail?.contentInfoList?.length > 12 ? 12 : boardDetail?.contentInfoList?.length;
            // 12개씩 로드되도록 slice
            const loadedItems = boardDetail?.contentInfoList?.slice(offset, offset + batchSize);
            // 보드 리스트 데이터를 보여줄 전체 리스트에 넣어준다.
            setFullList((prevList) => [...prevList, ...loadedItems]);
            // 다음 요청할 데이터의 offset 정보
            setOffset((prevOffset) => prevOffset + batchSize);
            // 다음 요청 전까지 요청 그만 보내도록 false로 변경
            setIsLoaded(false);

            if (batchSize < 12) {
                // 전체 데이터를 다 불러온 후 ( 불러온 값이 12보다 적어지면 다 불러온 것이니 )
                // 해당 값보다 적으면 마지막 페이지라고 생각하고 아예 로드를 중지시킨다.
                setStop(true);
            }
        }

    }, [isLoaded]);

    const getMoreItem = () => {
        setIsLoaded(true);
    };

    // callback
    const onIntersect = async ([entry], observer) => {
        // entry 요소가 교차되거나 Load중이 아니면

        if (entry.isIntersecting && !isLoaded) {
            // 관찰은 일단 멈추고
            observer.unobserve(entry.target);
            // 데이터 불러오기
            await getMoreItem();

            // 불러온 후 다시 관찰 실행
            observer.observe(entry.target);
        }
    }

    //////////////////////////////////////////////////////////////////////////////
    // search

    const [searchBoardText, setSearchBoardText] = useState()
    // 검색결과가 있으면 모든 컨텐츠 안보여주기
    const [fullContentView, setFullContentView] = useState(false)

    useEffect(() => {
        if (searchResult) {
            setFullContentView(true)
        }
    }, [searchResult]);
    // 검색 한 후 검색을 초기화하고 싶으면 어떻게 해야할까?

    return (
        <div>
            <SSsearchInput
                value={searchBoardText}
                title={`원하는 ${boardDetail?.boardInfo?.boardNm}를 빠르게 찾아보세요!`}
                placeholder={'검색어를 입력해주세요.'}
                onChange={(e) => setSearchBoardText(e.target.value)}
                onSearch={() => {
                    dispatch(cmsAction.getSearchBoard({
                        param: searchBoardText,
                        boardId: boardId
                    }))
                    console.log('boardId', boardId) // board 1 리턴됨 근데 undefined가 뜸 이거 어케함;;
                }
                }
            ></SSsearchInput>

            {searchResult && <BoardSearchTable path={path}/>}


            <Spin
                spinning={boardDetailLoading}
            >


                {/*추천 컨텐츠 임시 최대 5개 slice -- 추후 변경 */}
                <Carousel title={"당신에게 추천할게요."}>
                    {boardDetail?.contentInfoList?.slice(0, 5).map((item, idx) => (
                        <ContentsCard key={item?.contentId} item={item} idx={idx} onClick={() => {
                            dispatch(push(`/content/${item?.contentId}`))
                        }}/>
                    ))}
                </Carousel>


                {/*리스트 형식*/}
                {boardDetail?.boardInfo?.boardViewType !== 'list' ? (
                    /*<div>리스트</div>*/
                    <div></div>
                ) : (
                    /*카드 형식*/
                    <div
                        className={'w-full h-fit flex-col gap-[16px] mt-[60px] flex-wrap ' + (fullContentView || boardDetailLoading ? 'hidden ' : ' flex ')}
                    >
                        <h3>모든 컨텐츠 한 눈에 보기</h3>
                        <div className={'flex w-full h-auto flex-row flex-wrap gap-[16px]'}>
                            {fullList.map((item, idx) => (
                                <ContentsCard key={item?.contentId} item={item} idx={idx} onClick={() => {
                                    dispatch(push(`/content/${item?.contentId}`))
                                }}/>
                            ))}
                            <div ref={setTarget}></div>
                        </div>
                    </div>
                )}

            </Spin>
        </div>
    );
};

export default Board;
