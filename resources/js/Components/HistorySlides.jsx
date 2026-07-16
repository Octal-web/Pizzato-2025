import React, { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

export const HistorySlides = ({ slides }) => {
    const swiperTopRef = useRef(null);
    const swiperBottomRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleBottomSlideClick = (index) => {
        if (swiperTopRef.current) {
            swiperTopRef.current.swiper.slideToLoop(index);
        }
    };

    return (
        <div className="container max-w-large">
            <div className="relative">
                <div className="absolute top-0 max-md:-right-10 md:left-[calc(50%_-_3.5em)] h-[80%] md:h-[60%] w-15 md:w-[calc(50vw_+_3.5em)] bg-secondary" />
                <Swiper
                    ref={swiperTopRef}
                    modules={[EffectFade, Navigation, Autoplay]}
                    spaceBetween={10}
                    slidesPerView={1}
                    effect="fade"
                    fadeEffect={{ crossFade: true }}
                    autoplay={{ delay: 8000 }}
                    loop={true}
                    onSlideChange={(swiper) => {
                        setActiveIndex(swiper.realIndex);
                        if (swiperBottomRef.current) {
                            swiperBottomRef.current.swiper.slideTo(swiper.realIndex);
                        }
                    }}
                    className="top-carousel mb-20 !overflow-visible relative"
                >
                    {slides.map((item, index) => (
                        <SwiperSlide key={item.id}>
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <div className="relative pt-14 max-w-xl pr-12">
                                    <div className="relative max-md:mb-4 pl-14 overflow-hidden">
                                        <span className="absolute top-0 left-0 bottom-0 w-12 bg-white z-[1]" />
                                        <h2 className={`relative max-md:text-7xl text-[125px] text-secondary ${index === activeIndex ? 'transition-all duration-1000' : '-translate-x-full'}`}>{item.ano}</h2>
                                        <span className={`absolute top-[44%] md:top-1/2 left-1.5 w-6 h-6 bg-secondary rounded-full ring-1 ring-secondary ring-offset-4 z-[1] ${index === activeIndex ? 'transition-all duration-300' : 'scale-0'}`} />
                                    </div>

                                    <h5 className="text-xl uppercase max-w-[340px] mb-3">{item.titulo}</h5>
                                    <div className="font-secondary" dangerouslySetInnerHTML={{ __html: item.descricao }} />
                                </div>

                                <div className="relative md:pl-12 md:-mr-24 mt-10 md:-mt-20">
                                    <img className="block ml-auto" src={item.imagem} alt={item.titulo} />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="relative bg-secondary py-4 px-4 -mx-4 sm:py-6 sm:px-6 sm:-mx-6 md:py-8 md:px-12 md:-mx-12 xl:py-8 xl:px-24 xl:-mx-24 before:content-[''] before:absolute before:top-1/2 before:left-4 before:right-4 sm:before:left-6 sm:before:right-6 md:before:left-12 md:before:right-12 xl:before:left-24 xl:before:right-24 before:h-px before:bg-white mb-8 sm:mb-12 md:mb-16 xl:mb-20">
                <Swiper
                    ref={swiperBottomRef}
                    modules={[Navigation]}
                    slidesPerView="auto"
                    loop={false}
                    onSlideChange={(swiper) => {
                        if (swiperTopRef.current) {
                            swiperTopRef.current.swiper.slideToLoop(swiper.activeIndex);
                        }
                        setActiveIndex(swiper.activeIndex);
                    }}
                    className="bottom-carousel"
                >
                    {slides.map((item, index) => (
                        <SwiperSlide
                            key={item.id}
                            onClick={() => handleBottomSlideClick(index)}
                            className={`cursor-pointer !w-fit mx-auto ${index === 0 ? 'ml-0' : ''} ${index === slides.length - 1 ? 'mr-0' : ''}`}
                        >
                            <h4 className={`bg-secondary text-lg sm:text-xl md:text-2xl xl:text-2xl text-white${index === activeIndex ? ' font-bold' : ''} transition-all hover:text-opacity-75 px-3 sm:px-4 md:px-6 xl:px-8 ${index === 0 ? '!pl-0' : ''} ${index === slides.length - 1 ? '!pr-0' : ''}`}>{item.ano}</h4>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};