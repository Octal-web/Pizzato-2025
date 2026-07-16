import React, { useEffect, useRef, useState } from 'react';

import { ChevronDown } from 'lucide-react';

export const Doubt = ({
    index,
    pergunta,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const contentRef = useRef(null);

    const questionId = `faq-question-${pergunta.id ?? index}`;
    const answerId = `faq-answer-${pergunta.id ?? index}`;

    console.log(pergunta)

    useEffect(() => {
        const handleResize = () => {
            if (!isOpen) return;

            setIsOpen(false);

            requestAnimationFrame(() => {
                setIsOpen(true);
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isOpen]);

    return (
        <article
            className={[
                'overflow-hidden border border-neutral-200 bg-white transition-colors duration-300',
                isOpen
                    ? 'border-secondary'
                    : 'hover:border-secondary/70',
            ].join(' ')}
        >
            <h3>
                <button
                    id={questionId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => {
                        setIsOpen((current) => !current);
                    }}
                    className={[
                        'flex w-full items-center gap-5 text-left',
                        'px-5 py-5 sm:px-8 md:px-10',
                        isOpen ? 'pb-3 sm:pb-4' : '',
                    ].join(' ')}
                >
                    <span className="font-secondary flex-1 text-base sm:text-lg 2xl:text-xl leading-snug text-primary">
                        {pergunta.titulo}
                    </span>

                    <ChevronDown
                        size={28}
                        strokeWidth={1.8}
                        aria-hidden="true"
                        className={[
                            'shrink-0 text-secondary transition-transform duration-300',
                            isOpen ? 'rotate-180' : '',
                        ].join(' ')}
                    />
                </button>
            </h3>

            <div
                id={answerId}
                ref={contentRef}
                role="region"
                aria-labelledby={questionId}
                className="overflow-hidden transition-[max-height] duration-500 ease-in-out"
                style={{
                    maxHeight: isOpen
                        ? `${contentRef.current?.scrollHeight ?? 0}px`
                        : '0px',
                }}
            >
                <div className="px-5 pb-7 sm:px-8 md:px-10 sm:pb-9">
                    <div
                        className="font-secondary max-w-4xl text-sm sm:text-base leading-relaxed text-primary/80 [&_p:not(:last-child)]:mb-4 [&_a]:underline [&_a]:transition-opacity [&_a:hover]:opacity-70"
                        dangerouslySetInnerHTML={{
                            __html: pergunta.texto,
                        }}
                    />
                </div>
            </div>
        </article>
    );
};