import React, { useRef } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

import { Reveal } from './Reveal';

export const HomeProducts = ({ content, products }) => {
    const prevButtonRef = useRef(null);
    const nextButtonRef = useRef(null);

    return (
        <section className="relative">
            <Reveal className="absolute top-0 left-0 bottom-0 w-3/5" direction="bottom">
                <img src={`content/display/${content.imagem}`} className="w-full h-full object-cover" />
            </Reveal>
            <Reveal className="w-2/5 ml-auto pr-[5%]" direction="top">
                <div className="relative max-w-[468px] ml-[78px]">
                    <h4 className="text-3xl text-secondary text-center uppercase mb-8">{content.titulo}</h4>
                    <Swiper
                        slidesPerView={1}
                        allowTouchMove={false}
                        navigation={{
                            prevEl: prevButtonRef.current,
                            nextEl: nextButtonRef.current,
                        }}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 10000 }}
                        loop
                        modules={[Navigation, Pagination, Autoplay]}
                        className="product_carousel !pb-20 overflow-y-visible [&_.swiper-pagination]:!w-auto [&_.swiper-pagination]:!bottom-[3.2rem] [&_.swiper-pagination]:flex [&_.swiper-pagination]:gap-2 [&_.swiper-pagination]:!left-10 [&_.swiper-pagination]:!right-10 [&_.swiper-pagination-bullet]:w-full [&_.swiper-pagination-bullet]:rounded-none [&_.swiper-pagination-bullet]:!h-1 [&_.swiper-pagination-bullet.swiper-pagination-bullet-active]:!bg-secondary"
                    >
                        {products.map((destaque, index) => (
                            <SwiperSlide key={destaque.id}>
                                <div className="">
                                    <img
                                        className="mb-5"
                                        src={`content/products/featured/${destaque.imagem_destaque}`}
                                    />

                                    <h5 className="font-secondary text-center uppercase tracking-tight">{destaque.linha + ' ' + destaque.nome}</h5>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div className="absolute bottom-10 w-full z-10">
                        <div className="container max-w-large">
                            <div className="flex justify-between -mx-7">
                                <span
                                    ref={prevButtonRef}
                                    className="custom-prev-arrow relative w-7 h-7 cursor-pointer transition-all ease-out duration-200 hover:opacity-80 before:content-[''] before:absolute before:top-1.5 before:left-2 before:w-4 before:h-4 before:border-t-2 before:border-l-2 before:-rotate-45"
                                    
                                ></span>

                                <span
                                    ref={nextButtonRef}
                                    className="custom-prev-arrow relative w-7 h-7 cursor-pointer transition-all ease-out duration-200 hover:opacity-80 before:content-[''] before:absolute before:top-1.5 before:right-2 before:w-4 before:h-4 before:border-b-2 before:border-r-2 before:-rotate-45"
                                ></span>
                            </div>
                        </div>
                    </div>
                </div>
            </Reveal>
        </section>
    );
};
