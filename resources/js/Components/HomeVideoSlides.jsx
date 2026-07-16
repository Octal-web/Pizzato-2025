import { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/swiper-bundle.css';

export const HomeVideoSlides = ({ slides }) => {
    if (!slides) return;
    
    const prevButtonRef = useRef(null);
    const nextButtonRef = useRef(null);
    const swiperRef = useRef(null);

    useEffect(() => {
        if (swiperRef.current && prevButtonRef.current && nextButtonRef.current) {
            swiperRef.current.params.navigation.prevEl = prevButtonRef.current;
            swiperRef.current.params.navigation.nextEl = nextButtonRef.current;
            swiperRef.current.navigation.init();
            swiperRef.current.navigation.update();
        }
    }, [slides]);

    return (
        <section className="relative mt-16 md:mt-24">
            <div className="absolute -bottom-16 w-screen left-1/2 -translate-x-1/2 h-[calc(50%_+_4rem)] bg-neutral-900" />
            <div className="relative mx-10">
                <Swiper
                    slidesPerView={3}
                    centeredSlides={true}
                    modules={[Navigation, Autoplay]}
                    autoplay={{ delay: 6000 }}
                    loop={true}
                    navigation={{
                        prevEl: prevButtonRef.current,
                        nextEl: nextButtonRef.current,
                    }}
                    onBeforeInit={(swiper) => {
                        swiperRef.current = swiper;
                        swiper.params.navigation.prevEl = prevButtonRef.current;
                        swiper.params.navigation.nextEl = nextButtonRef.current;
                    }}
                    breakpoints={{
                        0: {
                            slidesPerView: 1,
                            centeredSlides: true,
                        },
                        768: {
                            slidesPerView: 1.6,
                            centeredSlides: true,
                        },
                        1280: {
                            slidesPerView: 3,
                            centeredSlides: true,
                        },
                    }}
                    className="max-md:!overflow-visible [&_.swiper-slide:not(.swiper-slide-active)_img]:scale-[0.85]"
                >
                    {slides.map((slide, index) => 
                        <SwiperSlide key={index}>
                            <div className="">
                                <img src={slide.imagem} alt={`Imagem ${index + 1}`} className="transition-all w-full aspect-[5/6] object-cover" />
                            </div>
                        </SwiperSlide>
                    )}
                    {slides.map((slide, index) => 
                        <SwiperSlide key={index}>
                            <div className="">
                                <img src={slide.imagem} alt={`Imagem ${index + slides.length}`} className="transition-all w-full aspect-[5/6] object-cover" />
                            </div>
                        </SwiperSlide>
                    )}
                </Swiper>

                    <button
                        ref={prevButtonRef}
                        className="absolute top-1/2 hidden -translate-y-1/2 left-0 z-[10] group w-16 2xl:w-20 h-16 2xl:h-20 max-md:flex items-center justify-center bg-white rounded-full shadow-md transition ease-out duration-200 disabled:opacity-60 hover:bg-secondary"
                    >
                        <ArrowIcon className="fill-black opacity-30 rotate-180 transition-all group-hover:opacity-100 group-hover:fill-white" />
                    </button>
                    <button
                        ref={nextButtonRef}
                        className="absolute top-1/2 hidden -translate-y-1/2 right-0 z-[10] group w-16 2xl:w-20 h-16 2xl:h-20 max-md:flex items-center justify-center bg-white rounded-full shadow-md transition ease-out duration-200 disabled:opacity-60 hover:bg-secondary"
                    >
                        <ArrowIcon className="fill-black opacity-30 transition-all group-hover:opacity-100 group-hover:fill-white" />
                    </button>
            </div>
        </section>
    );
};

const ArrowIcon = ({ className }) => {
    return (
        <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M19.023 10.938 10.273 2.188 12.5 0l12.5 12.5L12.5 25l-2.227-2.188 8.75-8.75H0v-3.125h19.023z" />
        </svg>
    )
};