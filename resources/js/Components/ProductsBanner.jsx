import React, { useEffect, useRef } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Reveal } from './Reveal';

export const ProductsBanner = ({ content }) => {
    const productsBgRef = useRef(null);

    useEffect(() => {  
        gsap.registerPlugin(ScrollTrigger);     
        gsap.fromTo(productsBgRef.current, 
        {
            backgroundPositionY: '100%',
        },
        {
            backgroundPositionY: '0%',
            duration: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: productsBgRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    }, []);

    return (
        <section 
            ref={productsBgRef}
            className="relative w-full aspect-[5/3] md:aspect-[4/1] min-[1422px]:h-[452px] min-[1422px]:aspect-auto max-[430px]:bg-[length:auto_120%] max-[570px]:bg-[length:200%] sm:bg-[length:170%] bg-[60%] xl:bg-[length:100%]"
            style={{
                backgroundImage: `url(${content.imagem})`,
            }}
        >
            <div className="h-full relative container max-w-large">
                <div className="absolute flex items-center justify-center left-0 right-0 h-full">
                    <Reveal className="text-3xl sm:text-4xl md:text-5xl text-white uppercase mt-[8%]" direction="left">{content.titulo}</Reveal>
                </div>
            </div>
        </section>
    );
};