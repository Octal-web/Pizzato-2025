import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade, A11y } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

import FormattedTitle from './FormattedTitle';

const stripHtml = (value) => {
    if (!value) return '';

    return String(value)
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
};

const getSlideAlt = (slide, index) => {
    return (
        slide.alt ||
        slide.imagem_alt ||
        stripHtml(slide.titulo) ||
        stripHtml(slide.descricao) ||
        `Destaque ${index + 1} da Pizzato`
    );
};

export const HomeSlides = ({ slides = [] }) => {
    const swiperRef = useRef(null);

    const [activeIndex, setActiveIndex] = useState(0);

    if (!slides.length) return null;

    return (
        <section
            className="relative"
            aria-label="Destaques da Pizzato"
        >
            <Swiper
                slidesPerView={1}
                allowTouchMove={false}
                effect="fade"
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 10000,
                    disableOnInteraction: false,
                }}
                loop
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                    setActiveIndex(swiper.realIndex);
                }}
                onSlideChange={(swiper) => {
                    setActiveIndex(swiper.realIndex);
                }}
                modules={[Pagination, Autoplay, EffectFade, A11y]}
                a11y={{
                    enabled: true,
                    prevSlideMessage: 'Slide anterior',
                    nextSlideMessage: 'Próximo slide',
                    firstSlideMessage: 'Este é o primeiro slide',
                    lastSlideMessage: 'Este é o último slide',
                    paginationBulletMessage: 'Ir para o slide {{index}}',
                }}
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={slide.id}>
                        <article className="relative z-[1] h-screen flex items-center">
                            {slide.tipo === 'imagem' && (
                                <picture className="absolute inset-0 block h-full w-full">
                                    {slide.imagem && (
                                        <source
                                            media="(min-width: 768px)"
                                            srcSet={slide.imagem}
                                        />
                                    )}

                                    <img
                                        src={slide.imagem_mobile || slide.imagem}
                                        alt={getSlideAlt(slide, index)}
                                        loading={index === 0 ? 'eager' : 'lazy'}
                                        decoding={index === 0 ? 'sync' : 'async'}
                                        fetchpriority={index === 0 ? 'high' : 'auto'}
                                        className="h-full w-full object-cover"
                                    />
                                </picture>
                            )}

                            {slide.tipo === 'video' && (
                                <video
                                    className="absolute inset-0 w-full h-full object-cover"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload={index === 0 ? 'auto' : 'metadata'}
                                    poster={slide.imagem_mobile || slide.imagem || undefined}
                                    aria-hidden="true"
                                >
                                    {slide.video && (
                                        <source
                                            media="(min-width: 768px)"
                                            src={slide.video}
                                            type="video/mp4"
                                        />
                                    )}

                                    <source
                                        src={slide.video_mobile || slide.video}
                                        type="video/mp4"
                                    />
                                </video>
                            )}

                            <div className="absolute inset-0 hidden md:block bg-[linear-gradient(90deg,rgba(0,0,0,1)_0%,rgba(0,0,0,0)_70%)]" />
                            <div className="absolute inset-0 md:hidden bg-[linear-gradient(2deg,rgb(0_0_0_/_67%)_0%,rgba(84,84,84,0)_102%)]" />

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
                        </article>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="absolute bottom-10 w-full z-10">
                <div className="container max-w-large">
                    <div className="flex justify-between -mx-16">
                        <button
                            type="button"
                            aria-label="Slide anterior"
                            onClick={() => {
                                swiperRef.current?.slidePrev();
                            }}
                            className="relative w-7 h-7 cursor-pointer transition-all ease-out duration-200 hover:opacity-80 before:content-[''] before:absolute before:top-1.5 before:left-2 before:w-4 before:h-4 before:border-t-2 before:border-l-2 before:-rotate-45"
                        />

                        <button
                            type="button"
                            aria-label="Próximo slide"
                            onClick={() => {
                                swiperRef.current?.slideNext();
                            }}
                            className="relative w-7 h-7 cursor-pointer transition-all ease-out duration-200 hover:opacity-80 before:content-[''] before:absolute before:top-1.5 before:right-2 before:w-4 before:h-4 before:border-b-2 before:border-r-2 before:-rotate-45"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};