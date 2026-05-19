import { useEffect, useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useLang } from "@/hooks/useLang";

gsap.registerPlugin(ScrollTrigger);

export const TourismMessage = ({ content }) => {
    const lang = useLang();

    const tourismRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(tourismRef.current, 
        {   
            backgroundPositionY: '70%',
        },
        {
            backgroundPositionY: '50%',
            duration: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: tourismRef.current,
                start: 'top bottom',
                end: 'top top',
                scrub: true,
            }
        });
    }, []);
    
    return (
        <section className="relative pt-16 xl:pt-20 pb-20 bg-cover" ref={tourismRef} style={{ backgroundImage: 'url(/site/img/history-bg.jpg'}}>
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative container max-w-medium">
                <h3 className="text-secondary text-3xl md:text-[35px] text-center 2xl:text-[40px] leading-[1.1] uppercase">{content.titulo}</h3>
                <p className="font-secondary text-sm md:text-base text-white text-center mt-7 max-w-xl mx-auto">{content.texto}</p>

                <a
                    className="relative group border-2 border-secondary py-2 px-6 lg:px-10 mt-10 mx-auto block w-fit"
                    href={content.link}
                    target={content.nova_aba ? '_blank' : '_self'}
                >
                    <span className="absolute inset-0 right-auto bg-secondary w-0 transition-all group-hover:w-full" />
                    <span className="relative font-secondary text-secondary text-lg lg:text-xl tracking-wide uppercase transition-all group-hover:text-white">{lang('agendeSuaExperiencia')}</span>
                </a>
            </div>
        </section>
    );
};
