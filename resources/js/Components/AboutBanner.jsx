import React, { useEffect, useRef } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Reveal } from './Reveal';

gsap.registerPlugin(ScrollTrigger);

export const AboutBanner = ({ content }) => {
    const aboutBgRef = useRef(null);

    useEffect(() => {
        if (!aboutBgRef.current) return;

        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        if (prefersReducedMotion) return;

        const context = gsap.context(() => {
            gsap.fromTo(aboutBgRef.current,
                {
                    objectPosition: '50% 100%',
                },
                {
                    objectPosition: '50% 0%',
                    duration: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: aboutBgRef.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true
                    }
                }
            );
        }, aboutBgRef);

        return () => context.revert();
    }, []);

    if (!content) return null;
    
    return (
        <>
            <section
                aria-label={content.titulo ? `Imagem de destaque: ${content.titulo}` : 'Imagem de destaque da Pizzato'}
                className="relative w-full aspect-[2/1] md:aspect-[35/9] 2xl:aspect-[32/9] overflow-hidden"
            >
                <picture>
                    {content.imagem_mobile && (
                        <source
                            media="(max-width: 767px)"
                            srcSet={content.imagem_mobile}
                        />
                    )}

                    <img
                        ref={aboutBgRef}
                        src={content.imagem}
                        alt={content.imagem_alt || content.titulo || 'Pizzato Vinhas e Vinhos'}
                        loading="eager"
                        decoding="sync"
                        fetchpriority="high"
                        className="w-full h-full object-cover max-[430px]:object-[60%_center]"
                    />
                </picture>
            </section>

            <section
                aria-labelledby="about-banner-title"
                className="mt-16 md:mt-20 2xl:mt-30 mb-16 2xl:mb-20"
            >
                <div className="relative container max-w-large">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <Reveal className="relative" direction="right">
                            <img
                                src="/site/img/logo.png"
                                alt="Pizzato Vinhas e Vinhos"
                                loading="lazy"
                                decoding="async"
                                className="block 2xl:absolute invert max-2xl:mb-4 2xl:-top-10 w-40 2xl:w-auto"
                            />

                            <h1
                                id="about-banner-title"
                                className="relative text-3xl sm:text-4xl xl:text-5xl max-2xl:text-balance text-secondary max-md:mb-10 2xl:leading-snug flex md:after:right-0 md:after:mt-10 md:after:h-[3px] md:after:w-1/4 xl:after:w-2/3 2xl:after:w-5/12 after:bg-secondary"
                            >
                                {content.titulo}
                            </h1>
                        </Reveal>

                        {content.texto && (
                            <Reveal direction="left">
                                <div
                                    className="font-secondary md:ml-12"
                                    dangerouslySetInnerHTML={{ __html: content.texto }}
                                />
                            </Reveal>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};