import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Reveal = ({ children, direction = "bottom", delay = 0, reverse = false, className }) => {
    const directions = {
        left: { x: -50, y: 0 },
        right: { x: 50, y: 0 },
        top: { x: 0, y: -50 },
        bottom: { x: 0, y: 50 },
        default: { x: 0, y: 30 },
    };
    
    const elementRef = useRef(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        // Limpa animações existentes para este elemento
        ScrollTrigger.getAll().forEach(st => {
            if (st.trigger === element) {
                st.kill();
            }
        });

        // Aguarda imagens carregarem (versão simplificada)
        const images = element.querySelectorAll('img');
        const imagePromises = Array.from(images).map(img => {
            if (img.complete) return Promise.resolve();
            
            return new Promise(resolve => {
                const timeout = setTimeout(resolve, 1000); // 1s timeout
                img.onload = img.onerror = () => {
                    clearTimeout(timeout);
                    resolve();
                };
            });
        });

        Promise.all(imagePromises).then(() => {
            let mm = gsap.matchMedia();
            
            mm.add("(min-width: 768px)", () => {
                const moveDirection = directions[direction] || directions.default;
                
                gsap.set(element, {
                    x: moveDirection.x,
                    y: moveDirection.y,
                    opacity: 0
                });

                gsap.to(element, {
                    x: 0,
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power2.out',
                    delay: delay * 0.1,
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 80%',
                        end: 'bottom 20%',
                        toggleActions: reverse ? 'play none resume reverse' : 'play none none none',
                    }
                });
            });

            mm.add("(max-width: 767px)", () => {
                gsap.set(element, {
                    y: 30,
                    opacity: 0
                });

                gsap.to(element, {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: 'power2.out',
                    delay: delay * 0.08,
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    }
                });
            });

            // Refresh após setup
            ScrollTrigger.refresh();
        });

        return () => {
            ScrollTrigger.getAll().forEach(st => {
                if (st.trigger === element) {
                    st.kill();
                }
            });
        };
    }, [direction, delay, reverse]);

    return (
        <div ref={elementRef} className={className}>
            {children}
        </div>
    );
};