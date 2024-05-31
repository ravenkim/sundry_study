import {useLocation} from "react-router-dom";
import {useEffect} from "react";

const Test2 = () => {
    let location = useLocation();

    useEffect(() => {
        console.log(location)
    }, [location]);

    return (
        <div>
            22222222222222
        </div>
    );
};

export default Test2;