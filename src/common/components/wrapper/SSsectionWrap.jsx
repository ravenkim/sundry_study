const SSsectionWrap = ({children, className, ...otherprops}) => {
    return (
        <section
            className={`m-0 mx-auto w-full desktop:max-w-[1000px] px-[20px] py-[50px] tablet:px-[60px] tablet:py-[80px] desktop:px-[0px] flex flex-col gap-[40px] tablet:gap-[60px] ` + className}
            {...otherprops}
        >
            {children}
        </section>
    )
}

export default SSsectionWrap
