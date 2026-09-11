import { Reveal } from './Reveal';

export const ImportsItem = ({ item, index }) => {
    const reversed = index % 2 === 1;

    return (
        <article
            className="mb-12 lg:mb-20 last:mb-0"
            aria-labelledby={`imports-item-title-${item.id}`}
        >
            <div className="container max-w-large">
                <div className={`grid grid-cols-1 items-center gap-6 md:gap-12 lg:gap-16 ${reversed ? 'md:grid-cols-[1.15fr_1fr]' : 'md:grid-cols-[0.85fr_1.3fr]'}`}>
                    <Reveal
                        direction={reversed ? 'right' : 'left'}
                        className={`w-full py-2 ${reversed ? 'md:order-2 md:pr-8 lg:pr-16' : 'md:pl-8 lg:pl-14'}`}
                    >
                        <h2
                            id={`imports-item-title-${item.id}`}
                            className="text-secondary text-2xl lg:text-3xl 2xl:text-4xl font-normal leading-tight uppercase"
                        >
                            {item.pais}
                        </h2>
                        {item.cidades && (
                            <p className="text-neutral-800 text-sm lg:text-base 2xl:text-lg mt-1 tracking-wide">
                                {item.cidades}
                            </p>
                        )}
                        {item.descricao && (
                            <div
                                className="font-secondary text-sm lg:text-base 2xl:text-lg text-neutral-700 leading-snug mt-4 [&_p+p]:mt-4"
                                dangerouslySetInnerHTML={{ __html: item.descricao }}
                            />
                        )}
                    </Reveal>

                    {item.imagem && (
                        <Reveal
                            direction={reversed ? 'left' : 'right'}
                            className={`w-full ${reversed ? 'md:order-1' : ''}`}
                        >
                            <img
                                src={`/content/imports/thumbs/${item.imagem}`}
                                alt={item.pais || ''}
                                loading="lazy"
                                decoding="async"
                                width="1000"
                                height="420"
                                className="w-full aspect-[12/5] object-cover"
                            />
                        </Reveal>
                    )}
                </div>
            </div>
        </article>
    );
};
