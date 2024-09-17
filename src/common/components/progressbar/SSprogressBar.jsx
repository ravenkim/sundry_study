const SSprogressBar = ({ totalValue = 100, currentValue = 50 }) => {
    const percentage = Math.min((currentValue / totalValue) * 100, 100);

    return (
        <div className="h-1 w-full bg-muted relative">
            <div
                className="h-1 bg-primary rounded-[10px] shadow-inner"
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
}

export default SSprogressBar;