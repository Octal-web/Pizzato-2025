import React, { useEffect, useRef } from "react";
import { Link } from "@inertiajs/react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Reveal } from "./Reveal";
import { VideoPlayer } from "./VideoPlayer";

export const TourismBanner = ({ content }) => {
    const tourismBgRef = useRef(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        gsap.fromTo(
            tourismBgRef.current,
            {
                backgroundPositionY: "100%",
            },
            {
                backgroundPositionY: "0%",
                duration: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: tourismBgRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                },
            },
        );
    }, []);

    return (
        <>
            <section
                ref={tourismBgRef}
                className="relative w-full max-md:h-[600px] md:aspect-[16/8] max-[430px]:bg-[length:auto_120%] max-[570px]:bg-[length:200%] sm:bg-[length:170%] bg-[60%] xl:bg-[length:100%]"
                aria-labelledby="tourism-banner-title"
                style={{
                    backgroundImage: `url(${content.imagem})`,
                }}
            >
                <div
                    className="absolute inset-0 bg-black opacity-50"
                    aria-hidden="true"
                />
                <div className="absolute top-0 left-0 right-0 h-full max-h-[780px]">
                    <div className="container max-w-large h-full">
                        <Reveal
                            direction="top"
                            className="h-full flex flex-col items-center justify-center text-center md:-mt-20 2xl:mt-0"
                        >
                            <h3
                                id="tourism-banner-title"
                                className="max-w-3xl text-3xl md:text-4xl sm:text-5xl text-white 2xl:leading-snug mb-8 mx-3"
                            >
                                {content.titulo}
                            </h3>
                            <div
                                className="max-w-4xl font-secondary text-sm sm:text-base 2xl:text-lg text-white"
                                dangerouslySetInnerHTML={{
                                    __html: content.texto,
                                }}
                            />
                        </Reveal>
                    </div>
                </div>
            </section>

            <div className="container max-w-large">
                <div className="-mt-[20%] -mx-[5vw] md:mx-auto">
                    <VideoPlayer
                        src={content.arquivo}
                        classList={[]}
                        autoplay={false}
                    />
                </div>
            </div>
        </>
    );
};
