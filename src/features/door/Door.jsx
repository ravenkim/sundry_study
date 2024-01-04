import React, {useEffect, useState} from 'react';
import SSsearchInput from "/src/common/components/input/SSsearchInput.jsx";
import SSsectionWrap from "/src/common/components/wrapper/SSsectionWrap.jsx";
import SScardWrap from "/src/common/components/Card/SScardWrap.jsx";
import SScard from "/src/common/components/Card/SScard.jsx";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import DoorCard from '/src/data/DoorCard.jsx'
import {push} from "redux-first-history";
import {adminAction} from "../admin/adminReducer.jsx";
import {profileAction} from "../profile/profileReducer.jsx";
import SStable from "../../common/components/table/SStable.jsx";
import {doorAction} from "./doorReducer.jsx";
import DoorAllSearchTable from "./components/DoorAllSearchTable.jsx";
import {getBoardList} from "../cms/cmsAPI.jsx";
import {cmsAction} from "../cms/cmsReducer.jsx";

const Door = () => {
    const dispatch = useDispatch()

    const [serchAllText, setSerchAllText] = useState('')


    useEffect(() => {
        //todo 초기화 처리
    }, []);

    const {
        rentalUpdateStatus,
        searchResult,
        boardType
    } = useSelector(({adminReducer, doorReducer, cmsReducer}) => ({
            //임시로 업데이트 해주는 api 향후 삭제 예정
            rentalUpdateStatus: adminReducer.rentalUpdateStatus,
            searchResult: doorReducer.searchResult.data,
            boardType: cmsReducer.boardList.data,
        }),
        shallowEqual
    );



    //임시로 업데이트 해주는 api 향후 삭제 예정
    useEffect(() => {
        dispatch(adminAction.rentalUpdate())
    }, []);

    useEffect(() => {
        dispatch(cmsAction.getBoardList())
    }, []); // 원하는 서비스로 가장 빠르게 이동해보세요. 데이터 가져오기 // 프로필과 관리자는 하드매핑




    return (
        <>
            <SSsectionWrap className={'tablet:py-[0] py-[0] desktop:py-[0]'}>
                <SSsearchInput
                    value={serchAllText}
                    onChange={(e) => setSerchAllText(e.target.value)}
                    placeholder={'찾고자 하는 항목을 입력하세요. (전체 항목에서 검색됩니다)'}
                    title={'무엇을 찾으시나요? (전체 항목에서 검색됩니다)'}
                    onSearch={() =>
                        // console.log(serchAllText)
                        dispatch(doorAction.getSearchAll(serchAllText))
                }
                />
            </SSsectionWrap>




            <SSsectionWrap className={'tablet:py-[0] py-[0] desktop:py-[0]'}>
                {searchResult && <DoorAllSearchTable/>}
            </SSsectionWrap>









            <SSsectionWrap className={'desktop:gap-[20px] tablet:gap-[20px] gap-[20px] '}>
                <div className='flex flex-row justify-start items-center gap-[6px] h-[38px]'>
                    <span className={'-mb-[3px]'}>
                        <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M11 0C8.21628 0.00344012 5.54756 1.11079 3.57918 3.07918C1.61079 5.04756 0.50344 7.71628 0.5 10.5C0.5 13.326 2.7 17.266 7.041 22.209C7.53604 22.7715 8.14526 23.2222 8.82808 23.5308C9.5109 23.8395 10.2517 23.9992 11.001 23.9992C11.7503 23.9992 12.4911 23.8395 13.1739 23.5308C13.8567 23.2222 14.466 22.7715 14.961 22.209C19.3 17.267 21.5 13.327 21.5 10.5C21.4966 7.71628 20.3892 5.04756 18.4208 3.07918C16.4524 1.11079 13.7837 0.00344012 11 0ZM12.706 20.231C12.4879 20.4654 12.2239 20.6524 11.9304 20.7802C11.6369 20.9081 11.3202 20.974 11 20.974C10.6798 20.974 10.3631 20.9081 10.0696 20.7802C9.77608 20.6524 9.51206 20.4654 9.294 20.231C5.611 16.036 3.494 12.489 3.494 10.501C3.494 8.51188 4.28418 6.60422 5.6907 5.1977C7.09722 3.79118 9.00488 3.001 10.994 3.001C12.9831 3.001 14.8908 3.79118 16.2973 5.1977C17.7038 6.60422 18.494 8.51188 18.494 10.501C18.5 12.489 16.389 16.036 12.706 20.231Z"
                                fill="#232433"/>
                            <path
                                d="M11 6.05546C10.1371 6.05546 9.29356 6.31134 8.57607 6.79076C7.85858 7.27017 7.29936 7.95158 6.96914 8.74881C6.63891 9.54604 6.55251 10.4233 6.72086 11.2696C6.8892 12.116 7.30474 12.8934 7.91492 13.5036C8.52509 14.1137 9.3025 14.5293 10.1488 14.6976C10.9952 14.866 11.8724 14.7796 12.6697 14.4493C13.4669 14.1191 14.1483 13.5599 14.6277 12.8424C15.1071 12.1249 15.363 11.2814 15.363 10.4185C15.3617 9.26173 14.9016 8.15275 14.0837 7.33481C13.2657 6.51688 12.1568 6.05678 11 6.05546ZM11 11.7815C10.7304 11.7815 10.4669 11.7015 10.2428 11.5518C10.0186 11.402 9.84394 11.1891 9.74077 10.9401C9.63761 10.691 9.61062 10.4169 9.66321 10.1525C9.7158 9.88815 9.84562 9.64529 10.0362 9.45467C10.2269 9.26405 10.4697 9.13424 10.7341 9.08165C10.9985 9.02906 11.2726 9.05605 11.5216 9.15921C11.7707 9.26237 11.9835 9.43707 12.1333 9.66122C12.2831 9.88536 12.363 10.1489 12.363 10.4185C12.3628 10.7799 12.2191 11.1264 11.9635 11.382C11.708 11.6375 11.3614 11.7812 11 11.7815Z"
                                fill="#232433"/>
                        </svg>

                      
                    </span>
                    <h2>원하는 서비스로 가장 빠르게 이동해보세요.</h2>
                </div>
                <SScardWrap className={'flex flex-wrap w-full'}>
                    {boardType?.boardList?.map((boardList, idx)=> (
                        <SScard
                            key={idx}
                            className={'cursor-pointer min-w-[23.5%] max-w-[23.5%]'}
                            onClick={()=> {
                                dispatch(push(`/board/${boardList?.boardId}`))
                            }}
                        >
                            <div className={'p-[20px] box-border flex flex-col justify-between w-full'}>
                                <h3 className={'text-[20px] font-[NotoSansKR-700]'}>
                                    {boardList?.boardNm}
                                </h3>
                                {/*<div dangerouslySetInnerHTML={{__html: boardList?.svg}} className={'inline-flex justify-self-end self-end'}/>*/}
                            </div>
                        </SScard>
                    ))}
                    {DoorCard.map((item, idx) => (
                        <SScard onClick={() => {
                            dispatch(push(item.root))
                            item?.action === 'profileAction' ? dispatch(profileAction.setTab(item?.tab)) : false
                            item?.action === 'adminAction' ? dispatch(adminAction.setTab(item?.tab)) : false
                        }
                        } className={'cursor-pointer min-w-[23.5%] max-w-[23.5%]'} key={idx}>
                            <div className={'p-[20px] box-border flex flex-col justify-between w-full'}>
                                <h3 className={'text-[20px] font-[NotoSansKR-700]'}>
                                    {item.title}
                                </h3>
                                {/*<div dangerouslySetInnerHTML={{__html: item.svg}} className={'inline-flex justify-self-end self-end'}/>*/}
                                {idx === 0 ? (
                                    <img src="/src/assets/img/profile.svg" alt="#" className={'inline-flex justify-self-end self-end'}/>
                                ) : null}
                                {idx === 1 ? (
                                    <img src="/src/assets/img/manager.svg" alt="#" className={'inline-flex justify-self-end self-end'}/>
                                ) : null}
                            </div>
                        </SScard>
                    ))}
                </SScardWrap>

            </SSsectionWrap>
        </>
    );
};

export default Door;

