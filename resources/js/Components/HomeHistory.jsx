import React, { useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useLang } from "@/hooks/useLang";

import { Reveal } from './Reveal';

gsap.registerPlugin(ScrollTrigger);

export const HomeHistory = ({ content }) => {
    const lang = useLang();

    const historyBgRef = useRef(null);

    useEffect(() => {
        if (!historyBgRef.current) return;

        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        if (prefersReducedMotion) return;

        const context = gsap.context(() => {
            gsap.fromTo(historyBgRef.current,
                {
                    objectPosition: '50% 100%',
                },
                {
                    objectPosition: '50% 0%',
                    duration: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: historyBgRef.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true
                    }
                }
            );
        }, historyBgRef);

        return () => context.revert();
    }, []);

    return (
        <section
            aria-labelledby="home-history-title"
            className="relative overflow-hidden"
        >
            <div className="container max-w-large">
                <div className="grid grid-cols-1 md:grid-cols-2 items-end">
                    <div>
                        <h2
                            id="home-history-title"
                            className="flex items-end text-7xl sm:text-[80px] lg:text-[100px] 2xl:text-[140px] leading-none text-white uppercase pt-20 md:pt-50"
                        >
                            <img
                                ref={historyBgRef}
                                src="/site/img/history-bg.jpg"
                                alt=""
                                aria-hidden="true"
                                loading="lazy"
                                decoding="async"
                                className="absolute w-screen right-1/2 h-full md:h-[calc(100%_-_19rem)] object-cover max-[430px]:object-[60%_center] translate-x-1/2"
                            />

                            <div
                                aria-hidden="true"
                                className="absolute w-screen right-1/2 h-[calc(100%_-_19rem)] max-[430px]:bg-[length:auto_120%] max-[570px]:bg-[length:200%] sm:bg-[length:170%] bg-[60%] xl:bg-[length:100%] translate-x-1/2 bg-gradient-to-b from-black via-transparent to-black"
                            />

                            <Reveal className="relative max-w-2xl -mb-1.5 lg:-mb-2 2xl:-mb-3" direction="left">
                                {content.titulo}
                            </Reveal>
                        </h2>

                        <Reveal direction="left">
                            <h3 className="max-w-lg relative text-secondary text-3xl sm:text-4xl 2xl:text-[44px] leading-none mt-10">
                                {content.subtitulo}
                            </h3>

                            <div
                                className="font-secondary max-w-lg mt-8"
                                dangerouslySetInnerHTML={{ __html: content.texto }}
                            />

                            <Link
                                href={route('Institucional.historia')}
                                aria-label={`${lang('verLinhaDoTempo')} - ${content.titulo}`}
                                className="block md:text-xl font-secondary font-semibold w-fit bg-primary text-white text-center tracking-wide uppercase px-6 md:px-8 py-2 md:py-3 2xl:py-4 mt-10 transition-all hover:bg-opacity-90"
                            >
                                {lang('verLinhaDoTempo')}
                            </Link>
                        </Reveal>
                    </div>

                    <Reveal className="relative mt-40 hidden md:block" direction="right">
                        <img
                            src={content.imagem}
                            alt={content.imagem_alt || content.subtitulo || content.titulo}
                            loading="lazy"
                            decoding="async"
                        />
                    </Reveal>
                </div>
            </div>
        </section>
    );
};