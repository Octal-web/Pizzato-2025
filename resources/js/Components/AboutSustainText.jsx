import { Reveal } from './Reveal';

export const AboutSustainText = ({ content, reverse }) => {
    return (
        <section className="">
            <div className="container max-w-large">
                <div className="grid grid-cols-1 md:grid-cols-2 items-center max-md:gap-6 max-md:mt-20">
                    {reverse ? (
                        <>
                            <Reveal className="relative" direction="left">
                                <img src={content.imagem} className="w-full" />
                            </Reveal>

                            <Reveal className="md:pl-12" direction="right">
                                <h3 className="text-3xl md:text-4xl 2xl:text-5xl text-secondary mb-8 md:mb-10 text-balance">{content.titulo}</h3>
                                <div className="font-secondary max-w-xl" dangerouslySetInnerHTML={{ __html: content.texto }} />
                            </Reveal>
                        </>
                    ) : (
                        <>
                            <Reveal className="relative md:pr-12 max-md:order-1" direction="right">
                                <h3 className="text-3xl md:text-4xl 2xl:text-5xl text-secondary mb-8 md:mb-10 text-balance">{content.titulo}</h3>
                                <div className="font-secondary max-w-xl" dangerouslySetInnerHTML={{ __html: content.texto }} />
                            </Reveal>

                            <Reveal className="relative" direction="left">
                                <img src={content.imagem} className="w-full" />
                            </Reveal>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};