import React, { useEffect, useRef } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Reveal } from './Reveal';

export const HistoryBanner = ({ content }) => {
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
        <section
            ref={historyBgRef}
            className="relative w-full h-0 pb-[calc(80%)] md:pb-[calc(100%_*_71_/192)] max-[430px]:bg-[length:auto_120%] max-[570px]:bg-[length:200%] sm:bg-[length:170%] bg-[60%] xl:bg-[length:100%]"
            style={{
                backgroundImage: `url(${content.imagem})`,
            }}
        >
            <h3 className="absolute top-[40%] md:top-1/2 left-1/2 text-4xl sm:max-xl:text-5xl xl:text-[56px] text-white font-semibold text-center uppercase pb-20 -translate-x-1/2 xl:-translate-y-1/2 z-[1]">{content.titulo}</h3>

            <div className="absolute left-0 right-0 bottom-0 h-4/5 bg-gradient-to-t from-black/70" />
        </section>
    );
};