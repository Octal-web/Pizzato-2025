import React, { useState, useEffect, useRef } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Reveal } from './Reveal';
import { VideoPlayer } from './VideoPlayer';
import { HomeVideoSlides } from './HomeVideoSlides';

export const HomeVideo = ({ content, images }) => {
    const videoRef = useRef(null);

    // useEffect(() => {
    //     gsap.fromTo(videoRef.current, 
    //     {   
    //         y: '-150px',
    //         scale: 0
    //     },
    //     {
    //         y: 0,
    //         scale: 1,
    //         duration: 1,
    //         ease: 'none',
    //         scrollTrigger: {
    //             trigger: videoRef.current,
    //             start: 'top bottom',
    //             end: 'top center',
    //             scrub: true,
    //         }
    //     });
    // }, []);

    return (
        <section className="pt-16 xl:pt-20">
            <div className="container max-w-large">
                <div className="relative before:content-[''] before:absolute before:-top-16 xl:before:-top-20 before:left-4 sm:before:left-40 before:bottom-0 before:w-full before:bg-secondary before:-translate-x-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <Reveal className="" direction="right">
                            <h3 className="relative text-3xl sm:text-4xl 2xl:text-5xl text-secondary 2xl:w-3/4 max-w-[400px] 2xl:max-w-[494px] sm:leading-snug ml-12 sm:ml-40 md:ml-50 max-sm:mb-8 max-lg:mb-10 lg:ml-auto lg:after:absolute lg:after:right-2 lg:2xl:after:-right-10 after:top-10 after:h-[3px] after:max-w-30 2xl:after:max-w-36 after:w-1/2 after:bg-secondary after:translate-x-full">{content.titulo}</h3>
                        </Reveal>
                        <Reveal className="" direction="top">
                            <div className="font-secondary max-w-[468px] ml-12 sm:ml-40 md:ml-50 lg:ml-auto" dangerouslySetInnerHTML={{ __html: content.texto }} />
                        </Reveal>
                    </div>

                    <HomeVideoSlides slides={images} />

                    {/* <div className="mt-16 w-fit h-0 pb-[calc(100%_*_9_/_32)] min-[1422px]:pb-[360px] mx-auto"> */}
                    <div className="relative mt-10 sm:mt-16 -mx-[5vw] sm:mx-auto">
                        <div className="absolute left-1/2 bottom-0 h-[50%] w-screen bg-neutral-900 -translate-x-1/2" />
                        {/* <div className="relative z-[1]" ref={videoRef}>
                            <VideoPlayer src={`content/slides/videos/d/4c615d4daf1cf24d5d4cd1d9a02753f3.mp4`} classList={['sm:max-w-[78vw]']} autoplay={false} />
                        </div> */}
                    </div>
                </div>
            </div>
        </section>
    );
};
