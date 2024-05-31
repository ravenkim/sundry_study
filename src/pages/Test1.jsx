import { useNavigate } from 'react-router-dom';
import {useDispatch} from "react-redux";
import {routerAction} from "src/routes/routerReducer.jsx";

const Test1 = () => {
    const dispatch = useDispatch()


    const navigate = useNavigate();

    return (
        <div>
            <button
                onClick={() => dispatch(routerAction.locationChange(111111111))}
            >aaaaaa
            </button>
            <button
                onClick={() => dispatch(routerAction.initializeAll())}

            >bbbbbbbbbbbbbbbbbbbb
            </button>
            <button
                onClick={() => navigate('/bb', {state: [1, 2, 3]})}
            >bvvvvvvvvvvvvvvvvvvvvvvvvv
            </button>

            1111111111111111111111
        </div>
    );
};

export default Test1;