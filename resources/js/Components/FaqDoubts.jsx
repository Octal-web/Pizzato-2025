import React from 'react';

import { useLang } from "@/hooks/useLang";

import { Reveal } from './Reveal';
import { Doubt } from './Doubt';

export const FaqDoubts = ({ perguntas = [] }) => {
    const lang = useLang();

    if (!perguntas.length) return null;

    return (
        <section
            aria-labelledby="faq-doubts-title"
            className="relative pb-16 md:pb-20 2xl:pb-24 pt-6"
        >
            <div className="container max-w-large">
                <Reveal direction="bottom">
                    <h1
                        id="faq-doubts-title"
                        className="text-3xl sm:text-4xl xl:text-5xl text-secondary leading-tight text-center uppercase mb-12 md:mb-16"
                    >
                        {lang('perguntasFrequentes')}
                    </h1>
                </Reveal>

                <Reveal direction="bottom">
                    <div
                        role="list"
                        className="mx-auto max-w-5xl space-y-4"
                    >
                        {perguntas.map((pergunta, index) => (
                            <div
                                key={pergunta.id ?? index}
                                role="listitem"
                            >
                                <Doubt
                                    index={index}
                                    pergunta={pergunta}
                                />
                            </div>
                        ))}
                    </div>
                </Reveal>
            </div>
        </section>
    );
};