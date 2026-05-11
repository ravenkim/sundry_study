const SScardWrap = ({children, className}) => {
    return(
        <div className={'w-full flex flex-row flex-wrap gap-[16px] ' + className}>
            {children}
        </div>
    )
}
export default SScardWrap
