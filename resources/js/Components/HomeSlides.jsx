import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

import FormattedTitle from './FormattedTitle';

export const HomeSlides = ({ slides }) => {
    const swiperRef = useRef(null);
    const prevButtonRef = useRef(null);
    const nextButtonRef = useRef(null);

    const [activeIndex, setActiveIndex] = useState(0);

    const handleSlideChange = () => {
        const swiperInstance = swiperRef.current.swiper;
        setActiveIndex(swiperInstance.activeIndex);
    };

    useEffect(() => {
        const swiperInstance = swiperRef.current.swiper;
        setActiveIndex(swiperInstance.activeIndex);
    }, []);

    return (
        <div className="relative">
            <Swiper
                slidesPerView={1}
                allowTouchMove={false}
                effect="fade"
                navigation={{
                    prevEl: prevButtonRef.current,
                    nextEl: nextButtonRef.current,
                }}
                pagination={{ clickable: true }}
                autoplay={{ delay: 10000 }}
                loop
                onSlideChange={handleSlideChange}
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                ref={swiperRef}
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative z-[1] h-screen flex items-center">
                            {slide.tipo === 'imagem' && (
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url(${window.innerWidth >= 768 ? slide.imagem : slide.imagem_mobile})`,
                                    }}
                                ></div>
                            )}
                            {slide.tipo === 'video' && (
                                <video
                                    className="absolute inset-0 w-full h-full object-cover"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    src={window.innerWidth >= 768 ? slide.video : slide.video_mobile}
                                />
                            )}

                            <div
                                className="absolute inset-0"
                                style={{
                                    background: window.innerWidth >= 768
                                        ? "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)"
                                        : "linear-gradient(2deg, rgb(0 0 0 / 67%) 0%, rgba(84, 84, 84, 0) 102%)",
                                }}
                            ></div>

                            <div className="container max-w-large h-full">
                                <div
                                    className={`flex flex-col relative w-full h-full md:w-[70%] xl:w-1/2 max-w-[420px] 2xl:max-w-[520px] justify-end pb-20 2xl:pb-36 transition-opacity duration-1000 ease-in-out z-[1] ${
                                        activeIndex === index
                                            ? 'animate-fade-in-down'
                                            : 'opacity-0'
                                    }`}
                                >
                                    {slide.titulo && (
                                        <FormattedTitle text={slide.titulo} />
                                    )}
                                    {slide.descricao && (
                                        <div className="text-secondary text-xl sm:text-2xl 2xl:text-3xl text-balance">
                                            <p>{slide.descricao}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="absolute bottom-10 w-full z-10">
                <div className="container max-w-large">
                    <div className="flex justify-between -mx-16">
                        <span
                            ref={prevButtonRef}
                            className="relative w-7 h-7 cursor-pointer transition-all ease-out duration-200 hover:opacity-80 before:content-[''] before:absolute before:top-1.5 before:left-2 before:w-4 before:h-4 before:border-t-2 before:border-l-2 before:-rotate-45"
                            
                        ></span>

                        <span
                            ref={nextButtonRef}
                            className="relative w-7 h-7 cursor-pointer transition-all ease-out duration-200 hover:opacity-80 before:content-[''] before:absolute before:top-1.5 before:right-2 before:w-4 before:h-4 before:border-b-2 before:border-r-2 before:-rotate-45"
                        ></span>
                    </div>
                </div>
            </div>
        </div>
    );
};
