const STb1 = ({children, center = false}) => {
    return (
        <p
            className={`text-base ${center && 'text-center'}`}
        >
            {children}
        </p>
    )
}

export default STb1