import { useSelector, shallowEqual } from 'react-redux';
import {useState,useEffect} from "react"
const Background = ( { children }) => {



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
            }}
        >
            {children}

        </div>
    );
};

export default Background;
