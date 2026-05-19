import React, { useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useLang } from "@/hooks/useLang";

// import { HomeHorizontalLoop } from './HomeHorizontalLoop';

export const HomeGallery = ({ content, images }) => {
    const lang = useLang();
    
    const containerRef = useRef(null);
    const bgRef = useRef(null);
    const titleRef = useRef(null);
    const textRef = useRef(null);
    const btnRef = useRef(null);

    // const half = Math.ceil(images.length / 2);
    // const upperImages = images.slice(0, half);
    // const lowerImages = images.slice(half);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        gsap.fromTo(titleRef.current, 
        {
            y: 200,
        },
        {
            y: 0,
            duration: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: containerRef.current,
                start: '15% 85%',
                end: '35% 85%',
                scrub: true
            }
        });

        gsap.fromTo(bgRef.current, 
        {
            backgroundPositionY: '100%',
        },
        {
            backgroundPositionY: '0%',
            duration: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });

        gsap.fromTo(textRef.current, 
        {
            y: -200,
        },
        {
            y: 0,
            duration: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: containerRef.current,
                start: '20% 85%',
                end: '40% 85%',
                scrub: true
            }
        });

        gsap.fromTo(btnRef.current, 
        {
            opacity: 0,
        },
        {
            opacity: 1,
            duration: 0.4,
            delay: 0.3,
            ease: 'none',
            scrollTrigger: {
                trigger: containerRef.current,
                start: '30% 85%',
                toggleActions: 'play none resume reverse'
            },
        });
    }, []);

    return (
        <section ref={containerRef} className="relative pt-16 2xl:pt-30">
            <div
                ref={bgRef}
                className="absolute top-0 right-0 opacity-[0.3] left-20 -bottom-60 bg-cover sm:bg-[length:160%_auto] md:bg-[length:100%_auto]"
                style={{
                    backgroundImage: `url(${content.imagem})`,
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-white to-20% to-transparent" />
            </div>

            <div className="relative container max-w-large">
                <div className="relative pb-2 mb-10 md:mb-14">
                    <div className="overflow-hidden">
                        <h3 ref={titleRef} className="text-4xl 2xl:text-5xl text-secondary pb-2 leading-tight uppercase max-sm:tracking-tight">
                            {content.titulo}
                        </h3>
                    </div>
                    <span className="absolute -bottom-5 md:-bottom-6 left-0 w-1/2 max-w-20 h-1 md:h-[5px] bg-secondary" />
                </div>

                <div className="overflow-hidden">
                    <div ref={textRef} className="font-secondary max-w-3xl mb-8 md:mb-12 2xl:mb-16" dangerouslySetInnerHTML={{ __html: content.texto }} />
                </div>

                <Link ref={btnRef} href={route('Produtos.index')} className="block md:text-xl font-secondary font-semibold w-fit bg-primary text-white text-center tracking-wide uppercase px-6 md:px-8 py-2 md:py-3 2xl:py-4 mb-8 2xl:mb-16 transition-all hover:bg-opacity-90">{lang('conhecaNossosVinhos')}</Link>
            </div>
            {/* <div className="space-y-14">
                <HomeHorizontalLoop images={upperImages} direction="right" />

                <HomeHorizontalLoop images={lowerImages} direction="left" />
            </div> */}
        </section>
    );
};