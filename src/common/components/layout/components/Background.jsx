import {shallowEqual, useSelector} from 'react-redux';

const Background = ( { children, className }) => {



    const {
        bgColor
    } = useSelector(({assetsReducer}) => ({
            bgColor: assetsReducer.colors.bgColor,
        }),
        shallowEqual
    );




    return (
        <div
            style={{
                backgroundColor: bgColor,
                width: '100%', //
                height:'100vh',
                position:'relative'
            }}

            className={className}
        >
            {children}


        </div>
    );
};

export default Background;
