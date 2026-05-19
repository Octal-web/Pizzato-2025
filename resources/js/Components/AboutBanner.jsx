import React, { useEffect, useRef } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Reveal } from './Reveal';

export const AboutBanner = ({ content }) => {
    const aboutbgRef = useRef(null);

    useEffect(() => {  
        gsap.registerPlugin(ScrollTrigger);     
        gsap.fromTo(aboutbgRef.current, 
        {
            backgroundPositionY: '100%',
        },
        {
            backgroundPositionY: '0%',
            duration: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: aboutbgRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    }, []);
    
    return (
        <>
            <section
                ref={aboutbgRef}
                className="w-full aspect-[2/1] md:aspect-[35/9] 2xl:aspect-[32/9] max-[430px]:bg-[length:auto_120%] max-[570px]:bg-[length:200%] sm:bg-[length:170%] bg-[60%] xl:bg-[length:100%]"
                style={{
                    backgroundImage: `url(${content.imagem})`,
                }}
            >
            </section>

            <section className="mt-16 md:mt-20 2xl:mt-30 mb-16 2xl:mb-20">
                <div className="relative container max-w-large">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <Reveal className="relative" direction="right">
                            <img src={`/site/img/logo.png`} alt="Logo" className="block 2xl:absolute invert max-2xl:mb-4 2xl:-top-10 w-40 2xl:w-auto" />
                            <h3 className="relative text-3xl sm:text-4xl xl:text-5xl max-2xl:text-balance text-secondary max-md:mb-10 2xl:leading-snug flex md:after:right-0 md:after:mt-10 md:after:h-[3px] md:after:w-1/4 xl:after:w-2/3 2xl:after:w-5/12 after:bg-secondary">{content.titulo}</h3>
                        </Reveal>
                        <Reveal direction="left">
                            <div className="font-secondary md:ml-12" dangerouslySetInnerHTML={{ __html: content.texto }} />
                        </Reveal>
                    </div>
                </div>
            </section>
        </>
    );
};