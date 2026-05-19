import React, { useRef } from 'react';
import { Link } from '@inertiajs/react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

import { Reveal } from './Reveal';

export const HomeLines = ({ lines }) => {
    return (
        <section className="py-16 md:py-20">
            <div className="relative container max-w-large">
                <div className="relative before:content-[''] before:absolute before:-bottom-16 md:before:-bottom-20 before:left-4 md:before:left-40 before:h-[calc(50%_+_5rem)] before:w-full before:bg-secondary before:-translate-x-full">
                    <Swiper
                        slidesPerView={1.2}
                        slidesPerGroup={1}
                        spaceBetween={50}
                        autoplay={{ delay: 15000, stopOnLastSlide: false }}
                        modules={[Autoplay]}
                        breakpoints={{
                            0: {
                                spaceBetween: 16,
                            },
                            768: {
                                spaceBetween: 50,
                            },
                        }}
                        className="!overflow-visible"
                    >
                        {lines.map((item, index) => (
                            <SwiperSlide key={index} className="">
                                <div className="group flex flex-col items-center max-sm:aspect-[4/5] max-lg:aspect-[4/3] shadow-2xl transition-all hover:shadow-xl hover:shadow-md">
                                    <img
                                        className="w-full h-full object-cover max-sm:object-[65%_center]"
                                        src={item.imagem}
                                    />

                                    <div className="absolute inset-5 sm:inset-10 md:inset-16 flex flex-col">
                                        <div className="mt-[2%] 2xl:mt-[10%] mb-4 max-w-md">
                                            <h3 className="text-2xl sm:text-4xl text-secondary mb-4 sm:mb-8 text-balance max-sm:tracking-tight max-sm:leading-tight">{item.chamada}</h3>

                                            <div className="text-xs sm:text-sm md:text-base font-secondary text-white max-sm:tracking-tight mr-10 sm:mr-6 text-balance" dangerouslySetInnerHTML={{ __html: item.descricao }} />
                                        </div>

                                        <Link href={route('Linhas.linha', {slug: item.slug})} className="block sm:text-xl font-secondary font-semibold w-fit bg-white text-black tracking-wide uppercase px-5 py-2 sm:px-8 sm:py-2 2xl:py-3 transition-all hover:bg-opacity-90 mt-auto">Quero Conhecer</Link>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};
