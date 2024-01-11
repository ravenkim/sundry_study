import Background from "/src/common/components/layout/components/Background.jsx";
import Login from "/src/features/accounts/Login.jsx";
import El_1 from '/src/assets/img/Ellipse 1.png';
import El_2 from '/src/assets/img/Ellipse 2.png';
import El_3 from '/src/assets/img/Ellipse 3.png';

const LoginPage = () => {


    //브라우저 가로 길이
    const width = window.innerWidth

    return (

        <Background className={'overflow-hidden'}>
            <img src={El_3} alt="#" className='absolute
            -bottom-[20%] -right-[50%]
            tablet:-bottom-[30%] tablet:-right-[20%]
            desktop:-bottom-[22%] desktop:-right-[10%]'/>
            <img src={El_2} alt="#" className='absolute z-0
            top-[25%] -left-[50%]
            tablet:-top-[25%] tablet:-left-[5%]
            desktop:-top-[360px] desktop:-left-[172px]'/>
            <img src={El_1} alt="#" className='absolute z-1
            -top-[25%] -left-[30%]
            tablet:-top-[40%] tablet:-left-[25%]
            desktop:-top-[15%] desktop:-left-[20%]'/>

            <Login/>

        </Background>
    );
};

export default LoginPage;
