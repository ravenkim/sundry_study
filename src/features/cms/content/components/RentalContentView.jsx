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
                        <li key={index} className={'text-[#ffffff] flex justify-center items-center text-[15px] gap-[8px]'}>
                            {/*{item.label}: {item.value}*/}
                            {item?.label === '강사명' && <><img src={author} alt="#" className={'w-[16px] '}/> {item?.value}</>}
                            {item?.label === '강의 키워드' && <><img src={keyword} alt="#" className={'w-[14px] mx-[1px]'}/> {item?.value}</>}
                            {item?.label === '수준' && <><img src={level} alt="#" className={'w-[16px] '}/> {item?.value}</>}
                            {item?.label === '강좌 링크' && <><img src={link} alt="#" className={'w-[16px]'}/>{item.value}</>}
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

    return (
        <div
            className={'w-full flex items-center flex-col'}
        >
            <div
                className={'w-full bg-[#4f5ff5] bg-opacity-90 flex justify-center items-center min-h-[349px] '}
            >
                <div
                    className={'w-[63%] flex justify-between '}
                >
                    <SSwrapper
                        className={'w-[300px] h-[300px] mb-[20px] box-border flex justify-center items-center '}
                    >
                        <img src={contentDetailImg} alt="#" className={'max-w-[300px] max-h-[full]'}/>


                    </SSwrapper>


                    <div
                        className={'w-[calc(100%-320px)] mt-[20px] min-h-[100px]'}
                    >

                        <h5
                            className={"text-[#ffffff] mb-[15px]"}
                        >{cateNm}</h5>


                        <h1
                            className={"text-[#ffffff] mb-[40px]"}
                        >{contentNm}</h1>
                        <h5
                            className={"text-[#ffffff] mb-[40px]"}
                        >{contentDesc}</h5>


                        {/*자유 필드*/}


                        <ul

                            className={"text-[#ffffff] flex flex-col gap-[6px] items-start"}
                        >

                            {freeFieldsData}
                        </ul>


                    </div>
                </div>


            </div>

            <div
                style={{
                    width: '63%',
                    minHeight: '500px',
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}
            >
                <div
                    style={{
                        width: '58%',
                    }}

                >
                    <div
                        className={'mt-[40px]'}
                    ><SSeditor
                        height={'90vh'}
                        isEditMode={false}
                        changeHandler={(contents) => {
                        }}
                        initContents={contentHtml}

                    /></div>

                </div>

                <div
                    style={{
                        width: '38%',
                        height: '500px',
                        display: "flex",
                        flexDirection: 'column'
                    }}
                >


                    <SSwrapper
                        style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            padding: '20px'

                        }}

                    >
                        현재 상태: {rentalStatNm}

                        <SSbutton
                            style={{marginTop: '20px'}}
                            disabled={true}
                        > 대여하기(배치로 인하여 2차 예정) </SSbutton>


                        <SSbutton disabled={false} style={{marginTop: '10px'}} onClick={() => {
                            setCalendarVisible(true)
                        }}> 예약하기 (2차 개발 예정)</SSbutton>

                        <SSCalendarWrap calendarVisible={calendarVisible} setCalendarVisible={setCalendarVisible}/>

                        {
                            // 좋아요 버튼
                            detail?.contentDtl?.likeYn === 'Y'
                                ? <SSbutton
                                    style={{marginTop: '10px'}}
                                    danger
                                    onClick={() => {
                                        dispatch(cmsAction.dislikeContent({contentId: contentId}))
                                    }}

                                > ❤️ 진짜로 이렇게 멋진걸 취소 한다구요? </SSbutton>
                                : <SSbutton
                                    onClick={() => {
                                        dispatch(cmsAction.likeContent({contentId: contentId}))
                                    }}
                                    style={{marginTop: '10px'}}
                                >
                                    ♡ 좋아요
                                </SSbutton>
                        }


                    </SSwrapper>


                    {/*수정 권한 있는지에 따라 보여줌*/}
                    {!readOnly &&
                        <div
                            style={{}}
                        >
                            디자인 변경 예정

                            <SSbutton disabled={true}> 수정 (2차 예정)</SSbutton>
                            <SSbutton disabled={true} danger> 삭제 (2차 예정) </SSbutton>
                        </div>
                    }


                </div>


            </div>



        </div>


    );
};

export default RentalContentView;
