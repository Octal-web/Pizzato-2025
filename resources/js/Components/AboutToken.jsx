import React, { useEffect, useRef } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Reveal } from './Reveal';

export const AboutToken = ({ content }) => {
    const tokenBgRef = useRef(null);

    useEffect(() => {  
        gsap.registerPlugin(ScrollTrigger);     
        gsap.fromTo(tokenBgRef.current, 
        {
            backgroundPositionY: '100%',
        },
        {
            backgroundPositionY: '0%',
            duration: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: tokenBgRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    }, []);

    return (
        <>
            <section className="relative bg-black pt-30 2xl:pt-48">
                <div ref={tokenBgRef} className="absolute inset-0 max-[430px]:bg-[length:auto_120%] max-[570px]:bg-[length:200%] sm:bg-[length:170%] bg-[60%] xl:bg-[length:100%] opacity-50" style={{ backgroundImage: "url('/site/img/token-bg.jpg ')" }} />

                <div className="relative container max-w-large">
                    <img src={`/site/img/logo.png`} className="block mx-auto mb-10" />
                    
                    <h1 className="text-5xl 2xl:text-[70px] text-secondary text-center leading-none max-w-5xl mx-auto mb-10">{content.titulo}</h1>
                    
                    <div className="font-secondary text-white text-center max-w-5xl px-3 mx-auto mb-10" dangerouslySetInnerHTML={{ __html: content.texto }} />

                    <img src={content.imagem} className="relative block mx-auto max-h-[90vh] -mb-[15%] z-[2]" loading="lazy" />
                </div>
            </section>
        </>
    );
};