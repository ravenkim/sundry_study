
const ContentsCard = ({
    idx,
    item,
    onClick,
    ...otherProps
                      }) => {

    return (
        <>
            <div key={item?.contentId}
                 className={"group relative rounded-[10px] overflow-hidden max-w-[188px] max-h-[188px] desktop:w-[188px] desktop:h-[188px] transition-all cursor-pointer shadow-[0px_1px_4px_rgba(0,0,0,0.3)]"}
                 onClick={onClick}
            >

                {item?.url && <img src={item?.url} alt="#" className={'w-full h-full'}/>}
                <div

                    className={'absolute border-box top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#232433] bg-opacity-70 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col p-[8px] overflow-hidden justify-between'}>
                    <div>
                        <h5 className={'text-[#ffffff] text-[16px] line-clamp-2 mb-[10px]'}>
                            {item?.contentNm}
                        </h5>
                        <p className={'text-[#ffffff] text-[10px] font-[NotoSansKR-300] line-clamp-3'}>
                            {item?.contentDesc}
                        </p>
                    </div>
                    <div className={'w-full flex flex-row justify-between items-end'}>
                        <div className={'flex flex-row gap-[6px] line-clamp-1 flex-auto flex-nowrap'}>
                            <span className={'text-[#51525C] text-[8px] box-border bg-[#ffffff] px-[7px] py-[3px] rounded-[10px] w-fit min-w-fit'}>{item?.cateNm}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ContentsCard
