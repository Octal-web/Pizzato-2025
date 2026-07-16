import React, { useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useLang } from "@/hooks/useLang";

import { Reveal } from './Reveal';

export const AboutVineyard = ({ vineyard }) => {
    const lang = useLang();

    const vineBgRef = useRef(null);

    useEffect(() => {  
        gsap.registerPlugin(ScrollTrigger);     
        gsap.fromTo(vineBgRef.current, 
        {
            backgroundPositionY: '100%',
        },
        {
            backgroundPositionY: '0%',
            duration: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: vineBgRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    }, []);

    const sections = [
        {
            title: lang('localizacao'),
            content: vineyard.localizacao,
            delay: 0,
        },
        {
            title: lang('composicaoDoSolo'),
            content: vineyard.composicao_solo,
            delay: 1,
        },
        {
            title: lang('clima'),
            content: vineyard.clima,
            delay: 2,
        },
        {
            title: lang('arquitetura'),
            content: vineyard.arquitetura,
            delay: 3,
        },
    ];

    return (
        <section>
            <div
                ref={vineBgRef}
                className="relative w-full h-[300px] md:h-[400px] max-[430px]:bg-[length:auto_120%] max-[570px]:bg-[length:200%] sm:bg-[length:170%] bg-[60%] xl:bg-[length:100%] flex items-end"
                style={{
                    backgroundImage: `url(${window.innerWidth >= 768 ? '/content/vineyards/banner/d/' + vineyard.banner : '/content/vineyards/banner/m/' + vineyard.banner_mobile})`,
                }}
            >
                <div className="absolute inset-0 bg-black opacity-50" />

                <div className="relative container max-w-large">
                    <h1 className="text-[68px] sm:text-[80px] md:text-[100px] 2xl:text-[110px] max-sm:!leading-none text-white -mb-1.5 sm:-mb-8 2xl:-mb-9">{vineyard.nome}</h1>
                </div>
            </div>

            <div className="my-16 2xl:my-20">
                <div className="relative container max-w-large">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <Reveal direction="right">
                            <h3 className="relative text-3xl sm:text-4xl xl:text-5xl text-balance text-secondary max-md:mb-6 2xl:leading-snug flex md:after:right-0 md:after:mt-10 md:after:h-[3px] md:after:w-1/4 xl:after:w-5/12 2xl:after:w-5/12 md:after:bg-secondary">{vineyard.subtitulo}</h3>
                        </Reveal>
                        <Reveal direction="left">
                            <div className="font-secondary md:ml-12" dangerouslySetInnerHTML={{ __html: vineyard.descricao }} />
                        </Reveal>
                    </div>
                </div>
            </div>

            <div className="bg-gray-100 pt-12 pb-14">
                <div className="relative container max-w-large">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 max-md:gap-5 max-sm:divide-y-[3px] md:divide-x-[3px]">
                        {sections.map(({ title, content }, index) => (
                            <Reveal
                                key={title}
                                className={`border-secondary ${index !== 0 ? 'md:pl-10 max-md:pt-5' : ''}`}
                                direction="right"
                                delay={index}
                            >
                                <h3 className="text-2xl 2xl:text-3xl text-secondary mb-4 2xl:mb-6">{title}</h3>
                                <div
                                    className="font-secondary md:max-w-40 leading-tight"
                                    dangerouslySetInnerHTML={{ __html: content }}
                                />
                            </Reveal>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};