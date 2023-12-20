import React ,{useState} from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows:true,
    pauseOnHover:true,
    vertical:false,
    draggable:true,
    responsive: [
        {
            breakpoint: 750,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
            }
        },
        {
            breakpoint: 414,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
            }
        },
    ]
}




const Carousel = ({
    title,
    children,
    className,
    style,
    ...otherProps
                  }) => {

    return (
        <>
            <div className={'w-full h-fit flex flex-col gap-[16px]'}
            >
                <h3>{title}</h3>
                <Slider {...settings} {...otherProps}>
                    {children}
                </Slider>
            </div>
        </>
    )
}

export default Carousel
