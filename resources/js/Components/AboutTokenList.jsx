import { Link } from '@inertiajs/react';

import { Reveal } from './Reveal';

export const AboutTokenList = ({ content }) => {
    return (
        <section className="relative bg-white pt-60 pb-20 z-[1] before:content-[''] before:absolute before:inset-0 before:bg-secondary before:bg-opacity-25 before:-z-[1]">
            <Reveal direction="left" className="max-w-[52rem] ml-auto pl-[10%]">
                <div className="flex pr-14">
                    <div>
                        <h3 className="text-5xl text-secondary max-w-80 leading-snug">{content.titulo}</h3>
                        <div className="font-secondary max-w-lg mt-8" dangerouslySetInnerHTML={{ __html: content.texto }} />
                        <Link href={route('Tokens.lista')} className="block text-xl font-secondary font-semibold w-fit bg-primary text-white text-center tracking-wide uppercase px-8 py-4 mt-16 transition-all hover:bg-opacity-90">Lista de Tokens</Link>
                    </div>
                    <div>
                        <img src={content.imagem} className="w-full max-w-[264px] ml-7" loading="lazy" />
                    </div>
                </div>
            </Reveal>
        </section>
    );
};