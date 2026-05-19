import { Link } from '@inertiajs/react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Reveal } from './Reveal';

export const TourismExperience = ({ experience, index }) => {
    return (
        <div className="mb-20 2xl:mb-40">
            <div className="container max-w-large">
                <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-between gap-12 md:gap-24">
                    <Reveal direction={`${index % 2 === 1 ? 'right' : 'left'}`} className={`max-w-[600px] ${index % 2 === 1 ? 'order-1 ml-auto' : 'max-md:order-1'}`}>
                        <h3 className="text-secondary text-3xl md:text-[35px] 2xl:text-[40px] leading-[1.1] uppercase">{experience.nome}</h3>
                        {experience.subtitulo && (
                            <h4 className={`text-neutral-600 ${experience.subtitulo.length > 28 ? 'text-[18px] font-light' : 'text-[25px] 2xl:text-[28px] font-semibold'} uppercase mt-1`}>{experience.subtitulo}</h4>
                        )}
                        <div className="font-secondary text-sm md:text-base mt-7" dangerouslySetInnerHTML={{ __html: experience.descricao }} />
                    </Reveal>

                    <Reveal direction={`${index % 2 === 1 ? 'left' : 'right'}`} className={`max-w-[600px] ${index % 2 === 1 ? '' : 'ml-auto'}`}>
                        <img src={`/content/experiences/${experience.imagem}`} className={`${index % 2 === 1 ? 'rounded-bl-[120px]' : 'rounded-tr-[120px]'}`} />
                    </Reveal>
                </div>
            </div>
        </div>
    );
};