import { Reveal } from './Reveal';

export const AboutTokenAccess = ({ content }) => {
    return (
        <section className="relative bg-white pt-60 pb-20 z-[1]">
            <Reveal direction="right" className="max-w-[52rem] pr-[10%]">
                <div className="ml-24">
                    <h3 className="text-5xl text-secondary leading-snug">{content.titulo}</h3>

                    <div className="font-secondary mt-8" dangerouslySetInnerHTML={{ __html: content.texto }} />
                
                    <img src={content.imagem} className="max-w-[450px] -ml-2 mt-10" loading="lazy" />
                </div>
            </Reveal>
        </section>
    );
};