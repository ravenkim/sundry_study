const SSprogressBar = ({ totalValue = 100, currentValue = 50 }) => {
    const percentage = Math.min((currentValue / totalValue) * 100, 100)

    return (
        <div className="relative h-1 w-full bg-muted mb-9">
            <div
                className=" h-1 rounded-[10px] bg-primary shadow-inner"
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    )
}

export default SSprogressBar
