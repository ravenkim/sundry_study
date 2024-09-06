


const SSinnerWrapper = ({ children }) => {
    return <div className="flex flex-col h-full">{children}</div>;
};

SSinnerWrapper.displayName = 'SSinnerWrapper';

SSinnerWrapper.Top = ({ children }) => {
    return <div className="flex-1 overflow-y-auto">{children}</div>;
};

SSinnerWrapper.Top.displayName = 'SSinnerWrapper.Top';

SSinnerWrapper.Bottom = ({ children }) => {
    return <div className="h-24 bg-gray-200">{children}</div>; // h-24는 약 100px에 해당합니다. 필요에 따라 조정하세요.
};

SSinnerWrapper.Bottom.displayName = 'SSinnerWrapper.Bottom';


export default SSinnerWrapper;



