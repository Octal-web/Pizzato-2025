import React, { useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useLang } from "@/hooks/useLang";

// import { HomeHorizontalLoop } from './HomeHorizontalLoop';

gsap.registerPlugin(ScrollTrigger);

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
        const container = containerRef.current;

        if (!container || !bgRef.current || !titleRef.current || !textRef.current || !btnRef.current) return;

        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        if (prefersReducedMotion) return;

        const context = gsap.context(() => {
            gsap.fromTo(titleRef.current, 
                {
                    y: 200,
                },
                {
                    y: 0,
                    duration: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: container,
                        start: '15% 85%',
                        end: '35% 85%',
                        scrub: true
                    }
                }
            );

            gsap.fromTo(bgRef.current, 
                {
                    objectPosition: '50% 100%',
                },
                {
                    objectPosition: '50% 0%',
                    duration: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: container,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true
                    }
                }
            );

            gsap.fromTo(textRef.current, 
                {
                    y: -200,
                },
                {
                    y: 0,
                    duration: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: container,
                        start: '20% 85%',
                        end: '40% 85%',
                        scrub: true
                    }
                }
            );

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
                        trigger: container,
                        start: '30% 85%',
                        toggleActions: 'play none resume reverse'
                    },
                }
            );
        }, container);

        return () => context.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            aria-labelledby="home-gallery-title"
            className="relative pt-16 2xl:pt-30"
        >
            <div className="absolute top-0 right-0 left-20 -bottom-60 overflow-hidden">
                <img
                    ref={bgRef}
                    src={content.imagem}
                    alt={content.imagem_alt || content.titulo || 'Vinhos Pizzato'}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover opacity-[0.3]"
                />

                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-r from-white to-20% to-transparent"
                />
            </div>

            <div className="relative container max-w-large">
                <div className="relative pb-2 mb-10 md:mb-14">
                    <div className="overflow-hidden">
                        <h2
                            id="home-gallery-title"
                            ref={titleRef}
                            className="text-4xl 2xl:text-5xl text-secondary pb-2 leading-tight uppercase max-sm:tracking-tight"
                        >
                            {content.titulo}
                        </h2>
                    </div>

                    <span
                        aria-hidden="true"
                        className="absolute -bottom-5 md:-bottom-6 left-0 w-1/2 max-w-20 h-1 md:h-[5px] bg-secondary"
                    />
                </div>

                <div className="overflow-hidden">
                    <div
                        ref={textRef}
                        className="font-secondary max-w-3xl mb-8 md:mb-12 2xl:mb-16"
                        dangerouslySetInnerHTML={{ __html: content.texto }}
                    />
                </div>

                <Link
                    ref={btnRef}
                    href={route('Produtos.index')}
                    aria-label={`${lang('conhecaNossosVinhos')} - ${content.titulo}`}
                    className="block md:text-xl font-secondary font-semibold w-fit bg-primary text-white text-center tracking-wide uppercase px-6 md:px-8 py-2 md:py-3 2xl:py-4 mb-8 2xl:mb-16 transition-all hover:bg-opacity-90"
                >
                    {lang('conhecaNossosVinhos')}
                </Link>
            </div>

            {/* <div className="space-y-14">
                <HomeHorizontalLoop images={upperImages} direction="right" />

                <HomeHorizontalLoop images={lowerImages} direction="left" />
            </div> */}
        </section>
    );
};