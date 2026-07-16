import React, { useEffect, useRef } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Reveal } from './Reveal';

export const AboutFooter = ({ content, images }) => {
    const footerbgRef = useRef(null);

    useEffect(() => {  
        gsap.registerPlugin(ScrollTrigger);     
        gsap.fromTo(footerbgRef.current, 
        {
            backgroundPositionY: '100%',
        },
        {
            backgroundPositionY: '-20%',
            duration: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: footerbgRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    }, []);

    return (
        <>
            {/* <section className="bg-gray-100 pt-10">
                <div className="container max-w-large">
                    <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-7 z-[1] mb-[calc(-25%_*_300_/_350)] md:mb-0">
                        {images.map((image, index) => (
                            <Reveal key={index} direction="left" delay={index}>
                                <img src={image.imagem} className="w-full md:mb-[calc(-50%_*_303_/_350)]" />
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section> */}
            
            <section
                ref={footerbgRef}
                className="w-full aspect-[3/2] md:aspect-[2] max-[430px]:bg-[length:auto_120%] max-[570px]:bg-[length:200%] sm:bg-[length:170%] bg-[60%] xl:bg-[length:100%]"
                style={{
                    backgroundImage: `url(${content.imagem})`,
                }}
            >
            </section>
        </>
    );
};