const STlabel =({children, center = false,  }) => {
    return (
        <p
            className={`text-base ${center && 'text-center'}`}
        >
            {children}
        </p>
    )
}
export default STlabel


