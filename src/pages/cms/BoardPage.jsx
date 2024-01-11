import React from 'react';
import SSsectionWrap from "../../common/components/wrapper/SSsectionWrap.jsx";
import SSlayout from "../../common/components/layout/SSlayout.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Board from "../../features/cms/Board.jsx";


const BoardPage = () => {


    return (
        <SSlayout>
            <SSsectionWrap>
                {/*임시 섹션 스타일 작성*/}
                <Board/>
            </SSsectionWrap>
        </SSlayout>
    );
};

export default BoardPage;


{/*추천 컨텐츠 임시*/
}
{/*<Carousel title={"당신에게 추천할게요."}>
                    {BackgroundImage.map((item, idx) => (
                        <ContentsCard key={item.index} item={item} idx={idx} onClick={()=>{console.log('/contents/:board/:content 로 이동시키기')}}  />
                    ))}
                </Carousel>*/
}

{/*모든컨텐츠 한눈에 보기 임시*/
}
{/*<Carousel title={"모든 컨텐츠 한 눈에 보기"}>
                    {BackgroundImage.map((item, idx) => (
                        <ContentsCard key={item.index} item={item} idx={idx} onClick={()=>{console.log(`${item?.route} 로 이동시키기`)}}  />
                    ))}
                </Carousel>*/
}

/*const BackgroundImage = [
    {
        index: 1,
        title: '팀 개발을 위한 Git, GitHub 입문',
        subTitle: '개인 프로젝트부터 현업 개발까지, 팀 개발에 필수적인 기술인 Git과 GitHub를 그림을 통해 쉽게 익힙니다. 개인 프로젝트부터 현업 개발까지, 팀 개발에 필수적인 기술인 Git과 GitHub를 그림을 통해 쉽게 익힙니다.',
        Src: '/src/assets/img/temporary/card_img_1.png',
        category: [
            {title:'데이터관리'},
            {title:'초급'},
        ],
        route:'ㅁㄴㅇㅁㄴㅇㅁㄴ',
        time:'2:25:32',
    },
    {
        index: 2,
        title: '팀 개발을 위한 Git, GitHub 입문',
        subTitle: '개인 프로젝트부터 현업 개발까지, 팀 개발에 필수적인 기술인 Git과 GitHub를 그림을 통해 쉽게 익힙니다.',
        Src: '/src/assets/img/temporary/card_img_2.png',
        category: [
            {title:'데이터관리'},
            {title:'초급'},
        ],
        route:'ㅁㄴㅇㄻㄴㅇㄻㄴㅇㄻㄴㅇㄻㄴㅇㄹ',
        time:'2:25:32',
    },
    {
        index: 3,
        title: '팀 개발을 위한 Git, GitHub 입문',
        subTitle: '개인 프로젝트부터 현업 개발까지, 팀 개발에 필수적인 기술인 Git과 GitHub를 그림을 통해 쉽게 익힙니다.',
        Src: '/src/assets/img/temporary/card_img_3.png',
        category: [
            {title:'데이터관리'},
            {title:'초급'},
        ],
        route:'ㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴ',
        time:'2:25:32',
    },
    {
        index: 4,
        title: '팀 개발을 위한 Git, GitHub 입문',
        subTitle: '개인 프로젝트부터 현업 개발까지, 팀 개발에 필수적인 기술인 Git과 GitHub를 그림을 통해 쉽게 익힙니다.',
        Src: '/src/assets/img/temporary/card_img_4.png',
    },
    {
        index: 5,
        title: '팀 개발을 위한 Git, GitHub 입문',
        subTitle: '개인 프로젝트부터 현업 개발까지, 팀 개발에 필수적인 기술인 Git과 GitHub를 그림을 통해 쉽게 익힙니다.',
        Src: '/src/assets/img/temporary/card_img_1.png',
    },
    {
        index: 6,
        title: '팀 개발을 위한 Git, GitHub 입문',
        subTitle: '개인 프로젝트부터 현업 개발까지, 팀 개발에 필수적인 기술인 Git과 GitHub를 그림을 통해 쉽게 익힙니다.',
        Src: '/src/assets/img/temporary/card_img_2.png',
    },
    {
        index: 7,
        title: '팀 개발을 위한 Git, GitHub 입문',
        subTitle: '개인 프로젝트부터 현업 개발까지, 팀 개발에 필수적인 기술인 Git과 GitHub를 그림을 통해 쉽게 익힙니다.',
        Src: '/src/assets/img/temporary/card_img_3.png',
    },
    {
        index: 8,
        title: '팀 개발을 위한 Git, GitHub 입문',
        subTitle: '개인 프로젝트부터 현업 개발까지, 팀 개발에 필수적인 기술인 Git과 GitHub를 그림을 통해 쉽게 익힙니다.',
        Src: '/src/assets/img/temporary/card_img_4.png',
    },
] // 임시 카드 map 이미지 데이터*/
