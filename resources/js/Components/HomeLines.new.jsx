import React, { useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useLang } from "@/hooks/useLang";

gsap.registerPlugin(ScrollTrigger);

export const HomeLines = ({ lines }) => {
    const lang = useLang();

    const containerRef = useRef(null);
    const scrollContainerRef = useRef(null);
    
    useEffect(() => {
        const container = containerRef.current;
        const scrollContainer = scrollContainerRef.current;
        
        if (!container || !scrollContainer || !lines.length) return;
        
        const getSlideWidth = () => {
            const isMobile = window.innerWidth < 768;
            return isMobile ? 85 : 69;
        };
        
        const slideWidthPercent = getSlideWidth();
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
                onRefresh: () => {
                    const newSlideWidthPercent = getSlideWidth();
                    scrollContainer.style.width = `${lines.length * newSlideWidthPercent}vw`;
                    scrollContainer.querySelectorAll('.line-slide').forEach(slide => {
                        slide.style.width = `${newSlideWidthPercent}vw`;
                    });
                },
                onUpdate: (self) => {
                    const progress = self.progress;
                    const activeIndex = Math.min(Math.floor(progress * lines.length), lines.length - 1);
                    
                    const indicators = container.querySelectorAll('.progress-dot');
                    indicators.forEach((dot, index) => {
                        if (index === activeIndex) {
                            dot.classList.add('active');
                        } else {
                            dot.classList.remove('active');
                        }
                    });
                    
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
    }, [lines]);
    
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .progress-dot.active {
                background: rgba(0, 0, 0, 0.9) !important;
                transform: scale(1.2);
            }
            
            .line-slide img {
                transition: transform 0.6s ease-out;
            }
        `;
        document.head.appendChild(style);
        
        return () => {
            document.head.removeChild(style);
        };
    }, []);
    
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
                                        <div className="relative group flex flex-col items-center max-sm:aspect-[2/3] max-xl:aspect-[4/3] shadow-2xl h-full shadow-2xl transition-all hover:shadow-xl">
                                            <img
                                                className="w-full h-full object-cover"
                                                src={item.imagem}
                                                alt={item.chamada}
                                            />

                                            <div className="absolute inset-0 bg-black/50" />

                                            <div className="absolute inset-5 sm:inset-10 md:inset-14 2xl:inset-16 flex flex-col">
                                                <div className="mt-[2%] 2xl:mt-[10%] mb-4 max-w-md">
                                                    <h3 className="text-3xl sm:text-4xl text-secondary mb-8 text-balance max-sm:tracking-tight max-sm:leading-tight">{item.chamada}</h3>

                                                    <div className="text-sm lg:text-base font-secondary text-white mr-10 sm:mr-6 text-balance" dangerouslySetInnerHTML={{ __html: item.descricao }} />
                                                </div>

                                                <Link href={route('Linhas.linha', {slug: item.slug})} className="block sm:text-xl font-secondary font-semibold w-fit bg-white text-black tracking-wide uppercase px-5 py-2 sm:px-8 sm:py-2 2xl:py-3 transition-all hover:bg-opacity-90 mt-auto">{lang('conheca')}</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            {/*
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
                <div className="flex space-x-3">
                    {lines.map((_, index) => (
                        <div 
                            key={index}
                            className="progress-dot w-3 h-3 rounded-full bg-white/30 transition-all duration-500 hover:bg-white/60 cursor-pointer"
                            style={{
                                background: 'rgba(255, 255, 255, 0.3)',
                                transition: 'all 0.5s ease'
                            }}
                        />
                    ))}
                </div>
            </div> */}
        </section>
    );
};