import React, { useRef, useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y } from 'swiper/modules';

import { useLang } from "@/hooks/useLang";

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

gsap.registerPlugin(ScrollTrigger);

const stripHtml = (value) => {
    if (!value) return '';

    return String(value)
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
};

const getLineAlt = (item) => {
    return (
        item.imagem_alt ||
        item.alt ||
        item.chamada ||
        item.nome ||
        'Linha de vinhos Pizzato'
    );
};

export const HomeLines = ({ lines = [] }) => {
    const lang = useLang();
    const [isMobile, setIsMobile] = useState(false);
    
    const containerRef = useRef(null);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    
    useEffect(() => {
        if (isMobile) return;
        
        const container = containerRef.current;
        const scrollContainer = scrollContainerRef.current;
        
        if (!container || !scrollContainer || !lines.length) return;

        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        if (prefersReducedMotion) return;
        
        const slideWidthPercent = 69;
        const slideWidth = (window.innerWidth * slideWidthPercent) / 100;
        const totalWidth = slideWidth * lines.length;
        const containerWidth = container.offsetWidth;
        const scrollDistance = totalWidth - containerWidth;
        
        scrollContainer.style.width = `${lines.length * slideWidthPercent}vw`;
        scrollContainer.querySelectorAll('.line-slide').forEach(slide => {
            slide.style.width = `${slideWidthPercent}vw`;
        });

        const context = gsap.context(() => {
            const horizontalScroll = gsap.to(scrollContainer, {
                x: -scrollDistance,
                ease: "none",
                scrollTrigger: {
                    trigger: container,
                    start: "top 10%",
                    end: () => `+=${scrollDistance * 0.8}`,
                    scrub: 1.4,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        const progress = self.progress;
                        const activeIndex = Math.min(Math.floor(progress * lines.length), lines.length - 1);
                        
                        scrollContainer.querySelectorAll('.line-slide img').forEach((img, index) => {
                            const offset = (index - activeIndex) * 0.1;
                            gsap.set(img, { scale: 1 + Math.abs(offset) * 0.05 });
                        });
                    }
                }
            });

            return () => horizontalScroll.kill();
        }, container);
        
        return () => context.revert();
    }, [lines, isMobile]);

    if (!lines.length) return null;
    
    const SlideContent = ({ item, index }) => {
        const titleId = `home-line-${item.slug ?? index}-title`;
        const descriptionText = stripHtml(item.descricao);

        return (
            <article
                aria-labelledby={titleId}
                className="relative group flex flex-col items-center max-sm:aspect-[2/3] max-2xl:aspect-[5/3] md:shadow-2xl transition-all hover:shadow-xl"
            >
                <img
                    className="w-full h-full object-cover"
                    src={item.imagem}
                    alt={getLineAlt(item)}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding={index === 0 ? 'sync' : 'async'}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                />
                
                <div aria-hidden="true" className="absolute inset-0 bg-black/50" />
                
                <div className="absolute inset-5 sm:inset-10 md:inset-14 2xl:inset-16 flex flex-col">
                    <div className="mt-[2%] 2xl:mt-[10%] mb-4 max-w-md">
                        <h3
                            id={titleId}
                            className="text-3xl sm:text-4xl text-secondary mb-8 text-balance max-sm:tracking-tight max-sm:leading-tight"
                        >
                            {item.chamada}
                        </h3>
                        
                        <div 
                            className="text-sm lg:text-base font-secondary text-white mr-6 text-balance" 
                            dangerouslySetInnerHTML={{ __html: item.descricao }} 
                        />
                    </div>
                    
                    <Link 
                        href={route('Linhas.linha', {slug: item.slug})}
                        aria-label={`${lang('conheca')} ${item.chamada || item.nome || descriptionText}`}
                        className="block sm:text-xl font-secondary font-semibold w-fit bg-white text-black tracking-wide uppercase px-5 py-2 sm:px-8 sm:py-2 2xl:py-3 transition-all hover:bg-opacity-90 mt-auto"
                    >
                        {lang('conheca')}
                    </Link>
                </div>
            </article>
        );
    };

    if (isMobile) {
        return (
            <section
                aria-labelledby="home-lines-title"
                className="overflow-hidden relative z-[1] pt-16"
            >
                <div className="container max-w-large">
                    <h2 id="home-lines-title" className="sr-only">
                        {lang('nossosVinhos')}
                    </h2>

                    <Swiper
                        modules={[A11y]}
                        spaceBetween={20}
                        slidesPerView={1.2}
                        a11y={{
                            enabled: true,
                            prevSlideMessage: 'Linha anterior',
                            nextSlideMessage: 'Próxima linha',
                            firstSlideMessage: 'Esta é a primeira linha',
                            lastSlideMessage: 'Esta é a última linha',
                        }}
                        className="!overflow-visible relative before:content-[''] before:absolute before:-top-10 2xl:before:top-40 before:left-4 before:-bottom-40 before:w-full before:bg-secondary before:-translate-x-full"
                    >
                        {lines.map((item, index) => (
                            <SwiperSlide key={item.slug ?? index}>
                                <SlideContent item={item} index={index} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>
        );
    }
    
    return (
        <section
            aria-labelledby="home-lines-title"
            className="overflow-hidden relative z-[1]"
        >
            <div className="container max-w-large">
                <h2 id="home-lines-title" className="sr-only">
                    {lang('nossosVinhos')}
                </h2>

                <div className="relative before:content-[''] before:absolute before:top-5 2xl:before:top-40 before:left-4 sm:before:left-40 before:-bottom-40 before:w-full before:bg-secondary before:-translate-x-full">
                    <div ref={containerRef} className="relative pt-16 md:pt-8 2xl:pt-20 -mx-4 sm:-mx-8">
                        <div 
                            ref={scrollContainerRef}
                            role="list"
                            aria-label={lang('nossosVinhos')}
                            className="flex will-change-transform"
                            style={{ width: `${lines.length * 69}vw` }}
                        >
                            {lines.map((item, index) => (
                                <div 
                                    key={item.slug ?? index}
                                    role="listitem"
                                    className="line-slide flex-shrink-0 relative"
                                    style={{ width: '69vw' }}
                                >
                                    <div className="relative h-full w-full max-w-large mx-auto px-4 sm:px-8">
                                        <SlideContent item={item} index={index} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};