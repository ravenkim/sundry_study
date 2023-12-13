const SScard = ({children, style, className,...otherProps}) => {
    return(
        <div
            className={`rounded-[10px] bg-[#ECEDF0] flex shadow-[0px_1px_4px_rgba(0,0,0,0.3)] desktop:min-w-[188px] desktop:min-h-[188px] `+className}
            style={{...style}}
            {...otherProps}
        >
            {children}
        </div>
    )
}

export default SScard
