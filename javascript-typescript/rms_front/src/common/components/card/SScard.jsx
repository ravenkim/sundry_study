const SScard = ({
                    children,
                    style,
                    className,
                    title,
                    image,
                    ...otherProps
}) => {
    return(
        <div
            className={`rounded-[10px] bg-[#ECEDF0] flex shadow-[0px_1px_4px_rgba(0,0,0,0.3)] flex-auto min-h-[184.75px] ` + className}
            style={{...style}}
            {...otherProps}
        >
            <div className={'p-[20px] box-border flex flex-col justify-between w-full '}>
                <h3 className={'text-[20px] font-[NotoSansKR-700]'}>
                    {title}
                </h3>
                {image && <img src={image} alt="#"
                               className={'inline-flex justify-self-end self-end'}/>}

            </div>
            {children}
        </div>
    )
}

export default SScard
