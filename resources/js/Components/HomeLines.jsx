import React, { useRef, useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useLang } from "@/hooks/useLang";

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

gsap.registerPlugin(ScrollTrigger);

export const HomeLines = ({ lines }) => {
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
        
        const slideWidthPercent = 69;
        const slideWidth = (window.innerWidth * slideWidthPercent) / 100;
        const totalWidth = slideWidth * lines.length;
        const containerWidth = container.offsetWidth;
        const scrollDistance = totalWidth - containerWidth;
        
        scrollContainer.style.width = `${lines.length * slideWidthPercent}vw`;
        scrollContainer.querySelectorAll('.line-slide').forEach(slide => {
            slide.style.width = `${slideWidthPercent}vw`;
        });
        
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
        
        return () => {
            horizontalScroll.kill();
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.trigger === container) {
                    trigger.kill();
                }
            });
        };
    }, [lines, isMobile]);
    
    const SlideContent = ({ item }) => (
        <div className="relative group flex flex-col items-center max-sm:aspect-[2/3] max-2xl:aspect-[5/3] md:shadow-2xl transition-all hover:shadow-xl">
            <img
                className="w-full h-full object-cover"
                src={item.imagem}
                alt={item.chamada}
            />
            
            <div className="absolute inset-0 bg-black/50" />
            
            <div className="absolute inset-5 sm:inset-10 md:inset-14 2xl:inset-16 flex flex-col">
                <div className="mt-[2%] 2xl:mt-[10%] mb-4 max-w-md">
                    <h3 className="text-3xl sm:text-4xl text-secondary mb-8 text-balance max-sm:tracking-tight max-sm:leading-tight">
                        {item.chamada}
                    </h3>
                    
                    <div 
                        className="text-sm lg:text-base font-secondary text-white mr-6 text-balance" 
                        dangerouslySetInnerHTML={{ __html: item.descricao }} 
                    />
                </div>
                
                <Link 
                    href={route('Linhas.linha', {slug: item.slug})} 
                    className="block sm:text-xl font-secondary font-semibold w-fit bg-white text-black tracking-wide uppercase px-5 py-2 sm:px-8 sm:py-2 2xl:py-3 transition-all hover:bg-opacity-90 mt-auto"
                >
                    {lang('conheca')}
                </Link>
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <section className="overflow-hidden relative z-[1] pt-16">
                <div className="container max-w-large">
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={1.2}
                        className="!overflow-visible relative before:content-[''] before:absolute before:-top-10 2xl:before:top-40 before:left-4 before:-bottom-40 before:w-full before:bg-secondary before:-translate-x-full"
                    >
                        {lines.map((item, index) => (
                            <SwiperSlide key={index}>
                                <div className="">
                                    <SlideContent item={item} />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>
        );
    }
    
    return (
        <section className="overflow-hidden relative z-[1]">
            <div className="container max-w-large">
                <div className="relative before:content-[''] before:absolute before:top-5 2xl:before:top-40 before:left-4 sm:before:left-40 before:-bottom-40 before:w-full before:bg-secondary before:-translate-x-full">
                    <div ref={containerRef} className="relative pt-16 md:pt-8 2xl:pt-20 -mx-4 sm:-mx-8">
                        <div 
                            ref={scrollContainerRef}
                            className="flex will-change-transform"
                            style={{ width: `${lines.length * 69}vw` }}
                        >
                            {lines.map((item, index) => (
                                <div 
                                    key={index} 
                                    className="line-slide flex-shrink-0 relative"
                                    style={{ width: '69vw' }}
                                >
                                    <div className="relative h-full w-full max-w-large mx-auto px-4 sm:px-8">
                                        <SlideContent item={item} />
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