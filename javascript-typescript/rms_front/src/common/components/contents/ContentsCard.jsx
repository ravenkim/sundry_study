import {useEffect, useState} from "react";
import UnLikedHeart from 'src/assets/img/heart.svg'
import LikeHeart from 'src/assets/img/fill_heart.svg'
import unImaged from 'src/assets/img/unImaged.svg'
import bookMark from 'src/assets/img/bookmark.svg'
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {cmsAction} from "../../../features/cms/cmsReducer.jsx";

const ContentsCard = ({
                          idx,
                          item,
                          onClick,
                          ...otherProps
                      }) => {

    const dispatch = useDispatch()

    const {
        likeContentStatus,
        detail,
    } = useSelector(({cmsReducer})=>({
        likeContentStatus : cmsReducer.likeContentStatus.data,
        detail: cmsReducer.contentDetail.data,
    }),
        shallowEqual
    )

    const [likeStatus, setLikeStatus] = useState(false)

    const handleLikeClick = (event) => {
        event.stopPropagation();
        setLikeStatus(!likeStatus);
    };

    return (
        <>
            <div key={item?.contentId}
                 className={'group relative flex-auto w-[23%] max-w-[23.5%] rounded-[10px] overflow-hidden transition-all cursor-pointer shadow-[0px_1px_4px_rgba(0,0,0,0.3)] hover:-translate-y-1 '}
                 onClick={onClick}
            >
                {/*이미지 박스*/}
                <div className={'w-full h-[150px] max-h-[150px] flex justify-center items-center overflow-hidden border-b-[1px] border-b-[#E3E4E8] border-solid'}>
                    {item?.url ? <img src={item?.url} alt="#" className={'w-full h-auto'}/> : <img src={unImaged} alt="#"/>}

                </div>

                {/*텍스트 박스*/}
                <div className={'box-border p-[8px] flex flex-col justify-between min-h-[140px]'}>
                    <div>
                        <h5 className={'text-[#232433] text-[18px] line-clamp-2 font-[NotoSansKR-700] break-keep mb-[3px]'}>{item?.contentNm}</h5>
                        <p className={'text-[#51525C] text-[12px] font-[NotoSansKR-300] line-clamp-2'}>{item?.contentDesc}</p>
                    </div>
                    <div className={'flex justify-end gap-[6px] items-center'}>
                        <div>
                            {/*// 컨텐츠 카테고리*/}
                            {/*<span
                                className={'text-[#51525C] text-[9px] box-border bg-[#ffffff] px-[7px] py-[3px] rounded-[10px] w-fit min-w-fit border-[1px] border-[#E3E4E8] border-solid'}>{item?.cateNm}</span>*/}
                            <span className={'text-[#4F5FF5] text-[10px] box-border bg-[#ffffff] px-[7px] py-[3px] rounded-[10px] w-fit min-w-fit border-[1px] border-[#E3E4E8] border-solid'}>
                                대여가능
                            </span>
                        </div>
                        <div className={'flex gap-[4px]'}>
                            <img src={likeStatus ? LikeHeart : UnLikedHeart}
                                 alt="좋아요"
                                 className={'transition-all hover:scale-125 relative z-2 cursor-pointer'}
                                 onClick={handleLikeClick}
                            />
                            {/*<img src={bookMark} alt="#"
                                 onClick={onClick}
                                 // to-do 예약하기창을 보여줄지 or 컨텐츠 페이지로 이동할지 확인하기
                            />*/}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ContentsCard
