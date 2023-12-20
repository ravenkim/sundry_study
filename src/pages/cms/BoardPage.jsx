import React from 'react';
import SSsectionWrap from "../../common/components/wrapper/SSsectionWrap.jsx";
import SSlayout from "../../common/components/layout/SSlayout.jsx";
import SSsearchInput from "../../common/components/input/SSsearchInput.jsx";
import Carousel from "../../common/components/Card/Carousel.jsx";
import SScard from "../../common/components/Card/SScard.jsx";
import Image1 from '../../assets/img/temporary/card_img_1.png'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BackgroundImage = [
    {
        index: 1,
        title: '팀 개발을 위한 Git, GitHub 입문',
        subTitle:'개인 프로젝트부터 현업 개발까지, 팀 개발에 필수적인 기술인 Git과 GitHub를 그림을 통해 쉽게 익힙니다.',
        Src: '/src/assets/img/temporary/card_img_1.png',
    },
    {
        index: 2,
        title: '팀 개발을 위한 Git, GitHub 입문',
        subTitle:'개인 프로젝트부터 현업 개발까지, 팀 개발에 필수적인 기술인 Git과 GitHub를 그림을 통해 쉽게 익힙니다.',
        Src: '/src/assets/img/temporary/card_img_2.png',
    },
    {
        index: 3,
        title: '팀 개발을 위한 Git, GitHub 입문',
        subTitle:'개인 프로젝트부터 현업 개발까지, 팀 개발에 필수적인 기술인 Git과 GitHub를 그림을 통해 쉽게 익힙니다.',
        Src: '/src/assets/img/temporary/card_img_3.png',
    },
    {
        index: 4,
        title: '팀 개발을 위한 Git, GitHub 입문',
        subTitle:'개인 프로젝트부터 현업 개발까지, 팀 개발에 필수적인 기술인 Git과 GitHub를 그림을 통해 쉽게 익힙니다.',
        Src: '/src/assets/img/temporary/card_img_4.png',
    },
    {
        index: 5,
        title: '팀 개발을 위한 Git, GitHub 입문',
        subTitle:'개인 프로젝트부터 현업 개발까지, 팀 개발에 필수적인 기술인 Git과 GitHub를 그림을 통해 쉽게 익힙니다.',
        Src: '/src/assets/img/temporary/card_img_1.png',
    },
    {
        index: 6,
        title: '팀 개발을 위한 Git, GitHub 입문',
        subTitle:'개인 프로젝트부터 현업 개발까지, 팀 개발에 필수적인 기술인 Git과 GitHub를 그림을 통해 쉽게 익힙니다.',
        Src: '/src/assets/img/temporary/card_img_2.png',
    },
    {
        index: 7,
        title: '팀 개발을 위한 Git, GitHub 입문',
        subTitle:'개인 프로젝트부터 현업 개발까지, 팀 개발에 필수적인 기술인 Git과 GitHub를 그림을 통해 쉽게 익힙니다.',
        Src: '/src/assets/img/temporary/card_img_3.png',
    },
    {
        index: 8,
        title: '팀 개발을 위한 Git, GitHub 입문',
        subTitle:'개인 프로젝트부터 현업 개발까지, 팀 개발에 필수적인 기술인 Git과 GitHub를 그림을 통해 쉽게 익힙니다.',
        Src: '/src/assets/img/temporary/card_img_4.png',
    },
] // 임시 카드 map 이미지 데이터

const BoardPage = () => {
    return (
        <SSlayout>
            <SSsectionWrap>
                {/*임시 섹션 스타일 작성*/}
                <SSsearchInput
                    title={'원하는 강의를 빠르게 찾아보세요!'}
                    placeholder={'검색어를 입력해주세요.'}
                ></SSsearchInput>
                <Carousel title={"당신에게 추천할게요."} >
                    {BackgroundImage.map((item, idx) => (
                        <div key={idx}
                            className={"group relative rounded-[10px] overflow-hidden max-w-[188px] max-h-[188px] desktop:w-[188px] desktop:h-[188px] transition-all"}
                        >
                            <img src={item.Src} alt="#" className={'w-full h-full'}/>
                            <div className={'absolute border-box top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#232433] bg-opacity-70 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all'}>
                                <h5>
                                    {item.title}
                                </h5>
                                <p>
                                    {item.subTitle}
                                </p>
                            </div>

                        </div>
                    ))}
                </Carousel>
            </SSsectionWrap>
        </SSlayout>
    );
};

export default BoardPage;
