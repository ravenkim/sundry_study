const ContentsCard = ({
    idx,
    item,
    onClick,
    ...otherProps
                      }) => {
    return (
        <>
            <div key={idx}
                 className={"group relative rounded-[10px] overflow-hidden max-w-[188px] max-h-[188px] desktop:w-[188px] desktop:h-[188px] transition-all cursor-pointer"}
                 onClick={onClick}
            >
                <img src={item?.Src} alt="#" className={'w-full h-full'}/>
                <div
                    className={'absolute border-box top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#232433] bg-opacity-70 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col p-[8px] overflow-hidden justify-between'}>
                    <div>
                        <h5 className={'text-[#ffffff] text-[16px] line-clamp-2 mb-[10px]'}>
                            {item?.title}
                        </h5>
                        <p className={'text-[#ffffff] text-[10px] font-[NotoSansKR-300] line-clamp-3'}>
                            {item?.subTitle}
                        </p>
                    </div>
                    <div className={'w-full flex flex-row justify-between items-end'}>
                        <div className={'flex flex-row gap-[6px] line-clamp-1 max-w-[100px] flex-auto flex-nowrap'}>
                            {item?.category?.map((cate,idx)=>(
                                <span key={idx}
                                className={'text-[#51525C] text-[8px] box-border bg-[#ffffff] px-[7px] py-[3px] rounded-[10px] w-fit min-w-fit'}>{cate?.title}</span>
                            ))}
                        </div>
                        <span className={'text-[#ffffff] text-[10px]'}>{item?.time}</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ContentsCard
