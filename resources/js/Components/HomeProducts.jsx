import React, { useEffect, useState, useRef } from 'react';
import { Link } from '@inertiajs/react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

import { Reveal } from './Reveal';

export const HomeProducts = ({ content, products }) => {
    const titleRef = useRef(null);
    const [activeIndexes, setActiveIndexes] = useState([]);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        animateLines(titleRef.current);
    }, []);

    const animateLines = (element, delay = 0) => {
        if (!element) return;

        const originalText = element.textContent;
        
        const tempElement = element.cloneNode(true);
        tempElement.style.position = 'absolute';
        tempElement.style.visibility = 'hidden';
        tempElement.style.height = 'auto';
        tempElement.style.whiteSpace = 'nowrap';
        element.parentNode.appendChild(tempElement);

        const singleLineHeight = tempElement.offsetHeight;
        
        tempElement.style.whiteSpace = 'normal';
        tempElement.style.width = element.offsetWidth + 'px';
        const totalHeight = tempElement.offsetHeight;
        
        element.parentNode.removeChild(tempElement);

        const words = originalText.split(' ');
        const lines = [];
        let currentLine = '';
        
        const measureSpan = document.createElement('span');
        measureSpan.style.visibility = 'hidden';
        measureSpan.style.position = 'absolute';
        measureSpan.style.fontSize = window.getComputedStyle(element).fontSize;
        measureSpan.style.fontFamily = window.getComputedStyle(element).fontFamily;
        measureSpan.style.fontWeight = window.getComputedStyle(element).fontWeight;
        document.body.appendChild(measureSpan);

        const maxWidth = element.offsetWidth;
        
        words.forEach((word, index) => {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            measureSpan.textContent = testLine;
            
            if (measureSpan.offsetWidth > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
            
            if (index === words.length - 1) {
                lines.push(currentLine);
            }
        });
        
        document.body.removeChild(measureSpan);

        element.innerHTML = '';
        
        const lineElements = [];
        
        lines.forEach((line, index) => {
            const lineContainer = document.createElement('div');
            lineContainer.style.overflow = 'hidden';
            lineContainer.style.position = 'relative';
            lineContainer.classList.add('pb-2.5');
            if (index + 1 === lines.length) {
                lineContainer.classList.add('text-secondary', 'font-bold');
            }
            
            const lineText = document.createElement('div');
            lineText.textContent = line;
            lineText.style.transform = 'translateY(100%)';
            
            lineContainer.appendChild(lineText);
            element.appendChild(lineContainer);
            lineElements.push(lineText);
        });
        
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
        
        lineElements.forEach((lineText, index) => {
            tl.to(lineText, {
                y: '0%',
                duration: 0.8,
                ease: 'power2.out'
            }, index * 0.1);
        });
    };

    return (
        <section className="pt-10 bg-neutral-900">
            <div className="relative container max-w-large">
                <div className="grid grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-2" direction="left">
                        <h4 ref={titleRef} className="max-w-md 2xl:max-w-lg relative text-secondary text-white text-[44px] sm:text-5xl 2xl:text-6xl leading-[1] sm:leading-[1.1] pb-1 mt-2 text-balance">{content.titulo}</h4>
                        <Reveal direction="top" delay={4} className="font-secondary text-white max-w-md 2xl:max-w-lg mt-8 mb-10 sm:mb-20">
                            <div dangerouslySetInnerHTML={{ __html: content.texto }} />
                        </Reveal>
                    </div>
                    <div className="max-sm:-mx-[5vw] md:col-span-3">
                        <Swiper
                            slidesPerView={3}
                            loop={true}
                            autoplay={{ delay: 10000 }}
                            modules={[Autoplay]}
                            breakpoints={{
                                0: {
                                    slidesPerView: 2,
                                },
                                1024: {
                                    slidesPerView: 3,
                                },
                            }}
                            onSlideChangeTransitionStart={() => setActiveIndexes([])}
                            onSlideChangeTransitionEnd={(swiper) => {
                                const indexes = [];
                                for (let i = 0; i < swiper.params.slidesPerView; i++) {
                                indexes.push((swiper.realIndex + i) % products.length);
                                }
                                setActiveIndexes(indexes);
                            }}
                        >
                            {products.map((item, index) => (
                                <SwiperSlide key={index} className="group p-3 pb-10 sm:p-10 max-2xl:pt-9 2xl:pb-12 overflow-hidden !h-auto">
                                    <div
                                        className={`absolute bg-gradient-to-t from-secondary to-secondary/70 w-[300%] pb-[340%] 2xl:pb-[300%] 
                                        top-0 left-0 -rotate-45 -translate-x-[110%] translate-y-[500px] 
                                        transition-all ease-out duration-500 
                                        md:group-hover:-translate-x-[40%] md:group-hover:-translate-y-[10%]
                                        ${
                                            activeIndexes.includes(index) &&
                                            " max-md:-translate-y-[12%] max-md:-translate-x-[22%] max-md:delay-300"
                                        }`}
                                    />
                                    <div className="relative">
                                        <Link href={route('Produtos.produto', {slug: item.slug})} >
                                            <img
                                                className="max-sm:max-w-[20vw] max-h-[300px] sm:max-h-[400px] mx-auto mb-3 sm:mb-6 2xl:mb-8"
                                                alt={item.nome}
                                                src={item.imagem}
                                            />

                                            <h4 className="text-lg 2xl:text-xl text-white text-center uppercase leading-tight min-h-[2.2em] 2xl:min-h-[2.5em]">{item.linha + ' ' + item.nome}</h4>
                                        </Link>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
    );
};