import React, {useEffect, useState} from 'react';
import SSeditor from "../../../../common/components/editor/SSeditor.jsx";
import SSwrapper from "../../../../common/components/wrapper/SSwrapper.jsx";
import SSbutton from "../../../../common/components/button/SSbutton.jsx";
import {shallowEqual, useSelector} from "react-redux";

const RentalContentView = () => {


    const {
        detail,
        contentDetailImg,
    } = useSelector(({router, cmsReducer}) => ({
            detail: cmsReducer.contentDetail.data,
            contentDetailImg: cmsReducer.contentDetailImg.data
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
                        <li key={index}>
                            <h6
                                className={"text-[#ffffff]"}

                            >
                                {item.label}: {item.value}
                            </h6>
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


    return (
        <div
            style={{
                width: '100%',
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <div
                className={'w-full '}
                style={{
                    backgroundColor: "rgba(79,95,245,0.9)",
                    display: 'flex',
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: 'center',
                    minHeight: '349px'
                }}

            >
                <div
                    style={{
                        width: '63%',
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <SSwrapper
                        style={{
                            width: '300px',
                            height: '300px',
                            marginBottom: '20px',
                            boxSizing: 'border-box',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <img src={contentDetailImg} alt="#" className={'max-w-[300px]] max-h-[full]'}/>


                    </SSwrapper>


                    <div
                        style={{
                            width: 'calc(100% - 320px)',
                            height: 100,
                            marginTop: '20px',
                            color: "red"
                        }}
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

                            className={"text-[#ffffff]"}
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
                        style={{marginTop: '20px'}}
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
                        > 대여하기 </SSbutton>
                        <SSbutton style={{marginTop: '10px'}}> 예약하기 </SSbutton>



                        <SSbutton style={{marginTop: '10px'}}> ♡ 좋아요 </SSbutton>
                        <SSbutton style={{marginTop: '10px'}}> ❤️ 좋아요 취소</SSbutton>

                    </SSwrapper>


                    <div
                        style={{marginTop: '20px'}}
                    >
                        <SSbutton> 수정 </SSbutton>
                        <SSbutton danger> 삭제 </SSbutton>
                    </div>


                </div>


            </div>
        </div>

    );
};

export default RentalContentView;
