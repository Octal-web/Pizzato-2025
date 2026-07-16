import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade, A11y } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

import FormattedTitle from './FormattedTitle';

const stripHtml = (value) => {
    if (!value) return '';

    return String(value)
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
};

export const HomeSlides = ({ slides = [] }) => {
    const swiperRef = useRef(null);
    const prevButtonRef = useRef(null);
    const nextButtonRef = useRef(null);

    const [activeIndex, setActiveIndex] = useState(0);

    if (!slides.length) return null;

    return (
        <section className="relative" aria-label="Destaques da Pizzato">
            <Swiper
                ref={swiperRef}
                slidesPerView={1}
                allowTouchMove={false}
                watchOverflow
                effect="fade"
                navigation={{ prevEl: prevButtonRef.current, nextEl: nextButtonRef.current }}
                pagination={{ clickable: true }}
                autoplay={{ delay: 10000, disableOnInteraction: false }}
                loop
                onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl = prevButtonRef.current;
                    swiper.params.navigation.nextEl = nextButtonRef.current;
                }}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                    setActiveIndex(swiper.realIndex);
                }}
                onSlideChange={(swiper) => {
                    setActiveIndex(swiper.realIndex);
                }}
                modules={[Navigation, Pagination, Autoplay, EffectFade, A11y]}
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
                        <article className="relative z-[1] flex h-screen items-center">
                            {slide.tipo === 'imagem' && (
                                <picture className="absolute inset-0 block h-full w-full">
                                    {slide.imagem && <source media="(min-width: 768px)" srcSet={slide.imagem} />}

                                    <img
                                        src={slide.imagem_mobile || slide.imagem}
                                        alt={slide.titulo}
                                        loading={index === 0 ? 'eager' : 'lazy'}
                                        decoding={index === 0 ? 'sync' : 'async'}
                                        fetchPriority={index === 0 ? 'high' : 'auto'}
                                        className="h-full w-full object-cover"
                                    />
                                </picture>
                            )}

                            {slide.tipo === 'video' && (
                                <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload={index === 0 ? 'auto' : 'metadata'} poster={slide.imagem_mobile || slide.imagem || undefined} aria-hidden="true">
                                    {slide.video && <source media="(min-width: 768px)" src={slide.video} type="video/mp4" />}
                                    <source src={slide.video_mobile || slide.video} type="video/mp4" />
                                </video>
                            )}

                            <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(0,0,0,1)_0%,rgba(0,0,0,0)_70%)] md:block" aria-hidden="true" />
                            <div className="absolute inset-0 bg-[linear-gradient(2deg,rgb(0_0_0_/_67%)_0%,rgba(84,84,84,0)_102%)] md:hidden" aria-hidden="true" />

                            <div className="container h-full max-w-large">
                                <div className={`relative z-[1] flex h-full w-full max-w-[420px] flex-col justify-end pb-20 transition-opacity duration-1000 ease-in-out md:w-[70%] xl:w-1/2 2xl:max-w-[520px] 2xl:pb-36 ${activeIndex === index ? 'animate-fade-in-down' : 'opacity-0'}`}>
                                    {slide.titulo && <FormattedTitle text={slide.titulo} />}

                                    {slide.descricao && (
                                        <div className="text-balance text-xl text-secondary sm:text-2xl 2xl:text-3xl">
                                            <p>{slide.descricao}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </article>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="absolute bottom-10 z-10 w-full">
                <div className="container max-w-large">
                    <div className="-mx-16 flex justify-between">
                        <button ref={prevButtonRef} type="button" aria-label="Slide anterior" className="relative h-7 w-7 cursor-pointer transition-all duration-200 ease-out before:absolute before:left-2 before:top-1.5 before:h-4 before:w-4 before:-rotate-45 before:border-l-2 before:border-t-2 before:content-[''] hover:opacity-80 disabled:pointer-events-none disabled:opacity-0" />

                        <button ref={nextButtonRef} type="button" aria-label="Próximo slide" className="relative h-7 w-7 cursor-pointer transition-all duration-200 ease-out before:absolute before:right-2 before:top-1.5 before:h-4 before:w-4 before:-rotate-45 before:border-b-2 before:border-r-2 before:content-[''] hover:opacity-80 disabled:pointer-events-none disabled:opacity-0" />
                    </div>
                </div>
            </div>
        </section>
    );
};