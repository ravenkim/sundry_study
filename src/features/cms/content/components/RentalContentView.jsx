import React, {useEffect, useState} from 'react';
import SSeditor from "src/common/components/editor/SSeditor.jsx";
import SSwrapper from "src/common/components/wrapper/SSwrapper.jsx";
import SSbutton from "src/common/components/button/SSbutton.jsx";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {cmsAction} from "src/features/cms/cmsReducer.jsx";
import SSCalendarWrap from "../../../../common/components/calendar/SSCalendarWrap.jsx";
import author from 'src/assets/img/author.svg'
import keyword from 'src/assets/img/keyword.svg'
import level from 'src/assets/img/level.svg'
import link from 'src/assets/img/link.svg'
import ToBack from 'src/assets/img/to_back_icon.svg'
import SSsectionWrap from "../../../../common/components/wrapper/SSsectionWrap.jsx";
import LikeHeart from "../../../../assets/img/fill_heart.svg";
import UnLikedHeart from "../../../../assets/img/heart.svg";

const RentalContentView = () => {

    const dispatch = useDispatch()

    const {
        detail,
        contentDetailImg,
        readOnly,
    } = useSelector(({router, cmsReducer}) => ({
            detail: cmsReducer.contentDetail.data,
            contentDetailImg: cmsReducer.contentDetailImg.data,
            readOnly: cmsReducer.contentDetail.data?.readOnly


        }),
        shallowEqual
    )


    const [userId, setUserId] = useState()
    const [contentId, setContentId] = useState()
    const [likeStatus, setLikeStatus] = useState(false) // 좋아요 눌렀는지 여부 -- 나중에 데이터로 받아오기


    useEffect(() => {
        if (detail) {
            //state 세팅
            const data = detail?.contentDtl


            setContentNm(data?.contentNm)
            setContentDesc(data?.contentDesc)
            setCateNm(data?.cateNm)

            setContentHtml(data?.contentHtml)
            setRentalStatNm(data?.rentalStatNm)
            setContentId(data?.contentId)

            if (detail?.boardFreeFields) {
                const obj = detail?.boardFreeFields
                const arr = Object.values(obj);
                const madeFreeField = arr.map((item, index) => (
                    item.type === 'input' ?
                        <li key={index}
                            className={'text-[#ffffff] flex justify-start text-[15px] gap-[8px] break-all ' + (item?.label === '강좌 링크' ? 'flex-nowrap items-start' : 'flex-wrap items-center')}>
                            {/*{item.label}: {item.value}*/}
                            {item?.label === '강사명' && <><img src={author} alt="#"
                                                             className={'w-[16px] '}/> {item?.value}</>}
                            {item?.label === '강의 키워드' && (
                                <>
                                    <img src={keyword} alt="#" className={'w-[14px] mx-[1px]'}/>
                                    {item?.value.split(',').map((value, idx) => (
                                        <span key={idx} className={'box-border bg-[#F5F5F5] text-[#51525C] rounded-[10px] px-[7px] drop-shadow-[0_2px_1px_rgba(0,0,0,0.25)]'}>{"#"}{value.trim()}</span>
                                    ))}
                                </>
                            )}
                            {item?.label === '수준' && <><img src={level} alt="#"
                                                            className={'w-[16px] '}/> {item?.value}</>}
                            {item?.label === '강좌 링크' && <><img src={link} alt="#"
                                                               className={'w-[16px] mt-[5px]'}/><span className={'break-all'}>{item.value}</span></>}
                        </li>
                        : null


                ))
                setFreeFieldsData(madeFreeField);


            }


        }
    }, [detail]);

    // 제목
    const [contentNm, setContentNm] = useState('')
    // 설명
    const [contentDesc, setContentDesc] = useState('')
    // 카테고리
    const [cateNm, setCateNm] = useState('')


    // 본문
    const [contentHtml, setContentHtml] = useState(null)


    const [rentalStatNm, setRentalStatNm] = useState('')

    //자유공간
    const [freeFieldsData, setFreeFieldsData] = useState()

    //예약 팝업 띄우기
    const [calendarVisible, setCalendarVisible] = useState(false)

    // 좋아요 버튼 누르기 -- 나중에 데이터로 변경
    const handleLikeClick = (event) => {
        event.stopPropagation();
        setLikeStatus(!likeStatus);
    };

    return (
        <>
            <SSsectionWrap
                className={'desktop:max-w-full desktop:py-0 w-full bg-gradient-to-r from-[#4F5FF5] to-[#656EC2] bg-opacity-90 flex justify-center items-center  min-h-[349px]'}
            >
                <div
                    className={'w-full flex justify-center max-w-none desktop:max-w-[1200px] flex-col tablet:flex-row tablet:justify-between gap-[20px]'}
                >
                    <SSwrapper
                        className={'tablet:min-w-[300px] tablet:max-h-[300px] tablet:mb-[20px] box-border flex justify-center items-center my-[0px] '}
                    >
                        <img src={contentDetailImg} alt="#"
                             className={'tablet:max-w-[300px] p-[3%] px-[6%] tablet:p-[0px] tablet:px-[0px] w-auto'}/>


                    </SSwrapper>


                    <div
                        className={'w-full mt-[20px] min-h-[100px] flex-auto'}
                    >

                        {/*<h5
                            className={"text-[#ffffff] mb-[15px] text-center tablet:text-left"}
                        >{cateNm}</h5>*/}


                        <h1
                            className={"text-[#ffffff] mb-[20px] text-center tablet:text-left tablet:mb-[40px]"}
                        >{contentNm}</h1>
                        <h5
                            className={"text-[#ffffff] mb-[20px] tablet:mb-[40px]"}
                        >{contentDesc}</h5>


                        {/*자유 필드*/}


                        <ul

                            className={"text-[#ffffff] flex flex-col gap-[6px] items-start"}
                        >

                            {freeFieldsData}
                        </ul>


                    </div>
                </div>

            </SSsectionWrap>

            <div className={'w-full max-w-[1200px] m-0 mx-auto pt-[20px] px-[20px] tablet:px-[60px] desktop:px-[0px]'}>
                <button className={'text-[#9A9DAD] flex items-center gap-[4px]'}><img src={ToBack} alt="#"/>뒤로가기
                </button>
            </div>

            <SSsectionWrap
                className={'desktop:flex-row desktop:max-w-[1200px] desktop:min-h-[500px] desktop:py-[20px] tablet:py-[20px] py-[0px] pt-[20px]'}
            >
                <div className={'flex flex-auto'}>
                    <SSeditor
                        height={'90vh'}
                        isEditMode={false}
                        changeHandler={(contents) => {
                        }}
                        initContents={contentHtml}
                    />
                </div>

                <div className={'flex flex-col w-full h-fit desktop:min-w-[350px] gap-[30px] flex-1 desktop:max-w-[400px]'}>
                    <SSwrapper
                        className={'box-border p-[20px] h-auto border-[1px] border-solid border-[#ACACBA] shadow-none rounded-[5px] my-[0px] gap-[8px] mt-[0px]'}>
                        <p className={'text-[#232433]'}>현재 상태: {rentalStatNm}</p>


                        <SSbutton
                            disabled={true}
                            className={'break-all whitespace-pre-wrap h-auto'}
                        > 대여하기(배치로 인하여 2차 예정) </SSbutton>


                        <SSbutton disabled={false} onClick={() => {
                            setCalendarVisible(true)
                        }}
                                  className={'break-all whitespace-pre-wrap h-auto'}
                        > 예약하기 (2차 개발 예정)</SSbutton>

                        <SSCalendarWrap calendarVisible={calendarVisible} setCalendarVisible={setCalendarVisible}/>

                        {
                            // 좋아요 버튼
                            detail?.contentDtl?.likeYn === 'Y'
                                ? <SSbutton
                                    danger
                                    onClick={() => {
                                        dispatch(cmsAction.dislikeContent({contentId: contentId}))
                                    }}
                                    className={'break-all whitespace-pre-wrap h-auto'}

                                > ❤️ 진짜로 이렇게 멋진걸 취소 한다구요? </SSbutton>
                                : <SSbutton
                                    onClick={() => {
                                        dispatch(cmsAction.likeContent({contentId: contentId}))
                                    }}
                                    className={'break-all'}
                                >
                                    ♡ 좋아요
                                </SSbutton>
                        }
                        <span className={'text-[#51525C] text-[14px] flex gap-[4px]'}>
                            <img src={likeStatus ? LikeHeart : UnLikedHeart}
                                 alt="좋아요"
                                 className={'transition-all hover:scale-125 relative z-2 cursor-pointer'}
                                 onClick={handleLikeClick}
                            />
                            4.7K
                        </span>


                    </SSwrapper>


                    {/*수정 권한 있는지에 따라 보여줌*/}
                    {!readOnly &&
                        <SSwrapper
                            className={'box-border p-[20px] h-auto border-[1px] border-solid border-[#ACACBA] shadow-none rounded-[5px] my-[0px] gap-[8px] mt-[0px]'}>

                            <p className={'-mb-[6px] text-[#232433]'}>보드 수정하기</p>
                            <span className={'text-[14px] text-[#51525C] '}>
                                보드 수정하기 전 필수적으로 확인해야 하는 정보들입니다.
                            </span>

                            <SSbutton disabled={false}> 수정 (2차 예정)</SSbutton>
                            <SSbutton disabled={false} danger> 삭제 (2차 예정) </SSbutton>

                        </SSwrapper>
                    }
                </div>
            </SSsectionWrap>
        </>
    );
};

export default RentalContentView;
