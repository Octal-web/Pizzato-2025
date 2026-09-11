import React, { useEffect, useRef } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Reveal } from './Reveal';

gsap.registerPlugin(ScrollTrigger);

export const ImportsBanner = ({ content }) => {
    const importsBgRef = useRef(null);

    useEffect(() => {
        if (!importsBgRef.current) return;

        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        if (prefersReducedMotion) return;

        const context = gsap.context(() => {
            gsap.fromTo(importsBgRef.current,
                {
                    objectPosition: '50% 100%',
                },
                {
                    objectPosition: '50% 0%',
                    duration: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: importsBgRef.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true
                    }
                }
            );
        }, importsBgRef);

        return () => context.revert();
    }, [content?.imagem]);

    if (!content) return null;

    const imageAlt = (content.imagem_alt || content.titulo || 'Pizzato Vinhas e Vinhos')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    const hasMobileImage = content.imagem_mobile &&
        !/\/content\/display\/?(?:[?#].*)?$/.test(content.imagem_mobile);
    
    return (
        <>
            <section
                aria-labelledby={content.titulo ? 'imports-banner-title' : undefined}
                className="relative isolate flex min-h-[460px] w-full items-center justify-center overflow-hidden bg-neutral-950 py-16 pt-28 md:min-h-0 md:aspect-[11/4] md:py-12 md:pt-24"
            >
                {content.imagem && (
                    <picture className="absolute inset-0 -z-20 block h-full w-full">
                        {hasMobileImage && (
                            <source
                                media="(max-width: 767px)"
                                srcSet={content.imagem_mobile}
                            />
                        )}

                        <img
                            ref={importsBgRef}
                            src={content.imagem}
                            alt={imageAlt}
                            loading="eager"
                            decoding="sync"
                            fetchpriority="high"
                            className="w-full h-full object-cover max-[430px]:object-[60%_center]"
                        />
                    </picture>
                )}
                <div className="absolute inset-0 -z-10 bg-black/30" aria-hidden="true" />
                
                <div className="relative mx-auto w-full max-w-4xl px-6 text-center text-white">
                    {content.titulo && (
                        <Reveal className="relative" direction="right">
                            <h1
                                id="imports-banner-title"
                                className="text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-normal uppercase leading-snug tracking-[0.04em]"
                                dangerouslySetInnerHTML={{ __html: content.titulo }}
                            />
                        </Reveal>
                    )}
                    <div className="mx-auto my-5 h-px w-16 bg-secondary md:my-6" aria-hidden="true" />

                    {content.texto && (
                        <Reveal direction="left">
                            <div
                                className="mx-auto max-w-2xl font-secondary text-sm md:text-base 2xl:text-lg leading-relaxed [&_p+p]:mt-0"
                                dangerouslySetInnerHTML={{ __html: content.texto }}
                            />
                        </Reveal>
                    )}
                </div>
            </section>
        </>
    );
};
