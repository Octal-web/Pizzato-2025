import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/swiper-bundle.css';

import { useLang } from "@/hooks/useLang";

export const LinesBanner = ({ current, lines, onChangeSlug }) => {
    const lang = useLang();

    const [isMobile, setIsMobile] = useState(false);
    const prevButtonRef = useRef(null);
    const nextButtonRef = useRef(null);
    const swiperRef = useRef(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (swiperRef.current && prevButtonRef.current && nextButtonRef.current) {
            swiperRef.current.params.navigation.prevEl = prevButtonRef.current;
            swiperRef.current.params.navigation.nextEl = nextButtonRef.current;
            swiperRef.current.navigation.init();
            swiperRef.current.navigation.update();
        }
    }, [lines]);

    const currentIndex = lines.findIndex(line => line.slug === current.slug);

    const handleSlideChange = (swiper) => {
        const newSlug = lines[swiper.activeIndex]?.slug;
        if (newSlug && newSlug !== current.slug) {
            onChangeSlug(newSlug);
        }
    };

    return (
        <section 
            className="relative bg-cover bg-center min-h-screen pt-16 md:pt-[12%]" 
            style={{ backgroundImage: `url(${current.banner})` }}
        >
            <div className="absolute inset-0 bg-black/40" />
            
            <div className="container max-w-large relative">
                <nav className="hidden md:block relative pr-30">
                    <div className="absolute w-3/5 max-w-[850px] left-0 -bottom-2 border-b border-neutral-600" />
                    <ul className="flex gap-20 py-10">
                        {lines.map((line) => (
                            <li key={line.slug}>
                                <button
                                    onClick={() => {
                                        if (current.slug !== line.slug) {
                                            onChangeSlug(line.slug);
                                        }
                                    }}
                                    className={`text-4xl text-white uppercase ${current.slug === line.slug ? 'opacity-100' : 'opacity-60 hover:opacity-80'} transition-all`}
                                >
                                    {line.nome}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <Link 
                        href={route('Produtos.index')} 
                        className="absolute top-11 -right-10 font-secondary px-8 py-1 text-white uppercase tracking-wide opacity-50 border border-white transition-all hover:opacity-70"
                    >
                        {lang('verMaisVinhos')}
                    </Link>
                </nav>

                <nav className="md:hidden relative">
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={0}
                        slidesPerView={1}
                        initialSlide={currentIndex}
                        onSlideChange={handleSlideChange}
                        navigation={{
                            prevEl: prevButtonRef.current,
                            nextEl: nextButtonRef.current,
                        }}
                        onBeforeInit={(swiper) => {
                            swiperRef.current = swiper;
                            swiper.params.navigation.prevEl = prevButtonRef.current;
                            swiper.params.navigation.nextEl = nextButtonRef.current;
                        }}
                        className="pb-10 md:pb-0 [&_.swiper-pagination]:!bottom-2 [&_.swiper-pagination-bullet]:!bg-white/50 [&_.swiper-pagination-bullet]:!w-2 [&_.swiper-pagination-bullet]:!h-2 [&_.swiper-pagination-bullet]:!mx-1.5 [&_.swiper-pagination-bullet]:!transition-all [&_.swiper-pagination-bullet]:!duration-300 [&_.swiper-pagination-bullet-active]:!bg-white [&_.swiper-pagination-bullet-active]:!w-8"
                    >
                        {lines.map((line) => (
                            <SwiperSlide key={line.slug} className="!flex !items-center !justify-center">
                                <h2 className="text-3xl text-white uppercase font-light tracking-wider text-center pt-6 pb-4">
                                    {line.nome}
                                </h2>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <button 
                        ref={prevButtonRef}
                        className="absolute left-4 top-[42%] -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <polyline points="15,18 9,12 15,6"></polyline>
                        </svg>
                    </button>
                    <button 
                        ref={nextButtonRef}
                        className="absolute right-4 top-[42%] -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <polyline points="9,6 15,12 9,18"></polyline>
                        </svg>
                    </button>

                    <div className="text-center">
                        <Link 
                            href={route('Produtos.index')} 
                            className="inline-block font-secondary px-6 py-1 md:py-2 text-xs md:text-sm text-white uppercase tracking-wide opacity-70 border border-white transition-all hover:opacity-90 hover:bg-white/10"
                        >
                            Ver mais vinhos
                        </Link>
                    </div>
                </nav>

                <div className="mt-8 md:mt-[8%] max-w-2xl px-4 md:px-0">
                    <h3 className="text-3xl md:text-4xl 2xl:text-[45px] leading-tight md:leading-none text-secondary mb-6 md:mb-8 text-balance max-w-lg">
                        {current.chamada}
                    </h3>
                    <div 
                        className="font-secondary text-white text-sm md:text-base leading-relaxed md:mr-20 lg:mr-6" 
                        dangerouslySetInnerHTML={{ __html: current.descricao }} 
                    />
                </div>
            </div>
        </section>
    );
};