import { useNavigate } from 'react-router-dom';

const Test1 = () => {


    const navigate = useNavigate();

    return (
        <div>
                <button
                    onClick={() => navigate('/bb', {state:[1,2,3]})}
                >aaaaaa
                </button>

            1111111111111111111111
        </div>
    );
};

export default Test1;