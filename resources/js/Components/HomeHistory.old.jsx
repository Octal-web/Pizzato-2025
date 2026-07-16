import React, { useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Reveal } from './Reveal';

export const HomeHistory = ({ content }) => {
    const historyBgRef = useRef(null);

    useEffect(() => {  
        gsap.registerPlugin(ScrollTrigger);     
        gsap.fromTo(historyBgRef.current, 
        {
            backgroundPositionY: '100%',
        },
        {
            backgroundPositionY: '0%',
            duration: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: historyBgRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    }, []);

    return (
        <section className="relative overflow-hidden">
            <div className="container max-w-large">
                <div className="h-0 pt-[calc(100%_*_9_/_32)] min-[1422px]:pt-[360px]" />

                <div className="grid grid-cols-2 items-end">
                    <div>
                        <h1 className="flex items-end text-[140px] leading-none text-white uppercase pt-50">
                            <div ref={historyBgRef} className="absolute w-screen right-1/2 h-[calc(100%_-_19rem)] max-[430px]:bg-[length:auto_120%] max-[570px]:bg-[length:200%] sm:bg-[length:170%] bg-[60%] xl:bg-[length:100%] translate-x-1/2" style={{ backgroundImage: "url('site/img/history-bg.jpg ')" }} />
                            <div className="absolute w-screen right-1/2 h-[calc(100%_-_19rem)] max-[430px]:bg-[length:auto_120%] max-[570px]:bg-[length:200%] sm:bg-[length:170%] bg-[60%] xl:bg-[length:100%] translate-x-1/2 bg-gradient-to-b from-black via-transparent to-black" />
                            <Reveal className="relative max-w-2xl -mb-3" direction="left">{content.titulo}</Reveal>
                        </h1>

                        <Reveal direction="left">
                            <h4 className="max-w-lg relative text-secondary text-[44px] leading-none mt-10">{content.subtitulo}</h4>

                            <div className="font-secondary max-w-lg mt-8" dangerouslySetInnerHTML={{ __html: content.texto }} />

                            <Link href={route('Institucional.historia')} className="block text-xl font-secondary font-semibold w-fit bg-primary text-white text-center tracking-wide uppercase px-8 py-4 mt-10 transition-all hover:bg-opacity-90">Ver linha do Tsempo</Link>
                        </Reveal>
                    </div>

                    <Reveal className="relative mt-40" direction="right">
                        <img src={content.imagem} loading="lazy" />
                    </Reveal>
                </div>
            </div>
        </section>
    );
};