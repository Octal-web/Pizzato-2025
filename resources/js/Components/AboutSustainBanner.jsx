import React, { useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Reveal } from './Reveal';

export const AboutSustainBanner = ({ content }) => {
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
                className="w-full h-0 pb-[calc(100%_*_9_/11)] md:pb-[calc(100%_*_9_/32)] max-[430px]:bg-[length:auto_120%] max-[570px]:bg-[length:200%] sm:bg-[length:170%] bg-[60%] xl:bg-[length:100%]"
                style={{
                    backgroundImage: `url(${content.imagem})`,
                }}
            >
            </section>

            <section className="pt-16 md:pt-30 pb-20 bg-neutral-100 -mb-32 md:-mb-10">
                <div className="relative container max-w-large">
                    <div>
                        <Reveal className="relative" direction="top">
                            <h3 className="text-3xl md:text-4xl 2xl:text-5xl font-light uppercase mb-6 md:mb-10">{content.titulo}</h3>
                            <div className="w-1/2 max-w-24 h-0.5 bg-secondary mb-6 md:mb-10" />
                            <div className="font-secondary max-w-5xl mb-16" dangerouslySetInnerHTML={{ __html: content.texto }} />
                        </Reveal>
                    </div>
                </div>
            </section>
        </>
    );
};