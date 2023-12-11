import { useSelector, shallowEqual } from 'react-redux';
import {useState,useEffect} from "react"
const Background = ( { children, className }) => {



    const {
        bgColor
    } = useSelector(({assetsReducer}) => ({
            bgColor: assetsReducer.colors.bgColor,
        }),
        shallowEqual
    );


    useEffect(() => {
            console.log(bgColor)

    }, [bgColor]);



    return (
        <div
            style={{
                backgroundColor: bgColor,
                width: '100vw', //
                height: '100vh', //
                position:'relative',
                overflow:"hidden"
            }}
            className={className}
        >
            {children}

        </div>
    );
};

export default Background;
