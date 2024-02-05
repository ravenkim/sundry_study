import {useState} from "react";
import UnLikedHeart from 'src/assets/img/heart.svg'
import LikeHeart from 'src/assets/img/fill_heart.svg'
import unImaged from 'src/assets/img/unImaged.svg'

const ContentsCard = ({
                          idx,
                          item,
                          onClick,
                          ...otherProps
                      }) => {

    const [likeStatus, setLikeStatus] = useState(false)

    const handleLikeClick = (event) => {
        event.stopPropagation();
        setLikeStatus(!likeStatus);
    };

    return (
        <>
            {/*<div key={item?.contentId}
                 className={"group relative rounded-[10px] overflow-hidden max-w-[188px] desktop:w-[188px] desktop:h-[188px] transition-all cursor-pointer bg-[#ffffff] shadow-[0px_1px_4px_rgba(0,0,0,0.3)] flex justify-center items-center " +
                     "w-[188px] h-[188px]"}
                 onClick={onClick}
            >

                {item?.url && <img src={item?.url} alt="#" className={'w-full h-auto'}/>}
                <div

                    className={'absolute border-box top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#232433] bg-opacity-70 transition-all flex flex-col p-[8px] overflow-hidden justify-between ' +
                        (item?.url ? 'opacity-0 invisible group-hover:opacity-100 group-hover:visible ' : 'opacity-100 visible ')}>
                    <div>
                        <h5 className={'text-[#ffffff] text-[20px] line-clamp-2 mb-[10px]'}>
                            {item?.contentNm}
                        </h5>
                        <p className={'text-[#ffffff] text-[12px] font-[NotoSansKR-300] line-clamp-3'}>
                            {item?.contentDesc}
                        </p>
                    </div>
                    <div className={'w-full flex flex-row justify-between items-end'}>
                        <div className={'flex flex-row gap-[6px] line-clamp-1 flex-auto flex-nowrap'}>
                            <span className={'text-[#51525C] text-[9px] box-border bg-[#ffffff] px-[7px] py-[3px] rounded-[10px] w-fit min-w-fit'}>{item?.cateNm}</span>
                        </div>
                    </div>
                </div>
            </div>*/}


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
                    <div className={'flex justify-between'}>
                        <div>
                            <span
                                className={'text-[#51525C] text-[9px] box-border bg-[#ffffff] px-[7px] py-[3px] rounded-[10px] w-fit min-w-fit border-[1px] border-[#E3E4E8] border-solid'}>{item?.cateNm}</span>
                        </div>
                        <div className={'flex gap-[4px]'}>
                            <img src={likeStatus ? LikeHeart : UnLikedHeart}
                                 alt="좋아요"
                                 className={'transition-all hover:scale-125 relative z-2'}
                                 onClick={handleLikeClick}

                            />
                            <span className={''}>예약</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ContentsCard
