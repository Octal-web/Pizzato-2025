import { Reveal } from './Reveal';

const getImageAlt = (image, fallback) => {
    return (
        image?.imagem_alt ||
        image?.alt ||
        image?.titulo ||
        fallback
    );
};

const OriginImage = ({ image, alt, className }) => {
    if (!image?.imagem) return null;

    return (
        <img
            src={image.imagem}
            alt={alt}
            loading="lazy"
            decoding="async"
            className={className}
        />
    );
};

export const AboutOrigin = ({ content, images = [] }) => {
    if (!content) return null;

    const titleId = 'about-origin-title';

    return (
        <section
            aria-labelledby={titleId}
            className="relative py-24 2xl:py-28"
        >
            <div className="container max-w-large">
                <div className="grid grid-cols-1 md:grid-cols-5 2xl:grid-cols-2 md:gap-24">
                    <div
                        className="flex items-start md:col-span-2 2xl:col-span-1 gap-3"
                        aria-label="Imagens sobre a origem da Pizzato"
                    >
                        <Reveal className="grid grid-rows-3 gap-3 aspect-[169/363]" direction="bottom">
                            <div className="row-span-2 w-full max-w-[350px]">
                                <OriginImage
                                    image={images[0]}
                                    alt={getImageAlt(images[0], `${content.titulo} - imagem 1`)}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="w-full max-w-[350px]">
                                <OriginImage
                                    image={images[1]}
                                    alt={getImageAlt(images[1], `${content.titulo} - imagem 2`)}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </Reveal>

                        <Reveal className="grid grid-rows-3 gap-3 aspect-[169/363] mt-[27%]" direction="top">
                            <div className="row-span-2 w-full max-w-[350px]">
                                <OriginImage
                                    image={images[2]}
                                    alt={getImageAlt(images[2], `${content.titulo} - imagem 3`)}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="w-full max-w-[350px]">
                                <OriginImage
                                    image={images[3]}
                                    alt={getImageAlt(images[3], `${content.titulo} - imagem 4`)}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </Reveal>
                    </div>

                    <div className="md:col-span-3 2xl:col-span-1">
                        <h2
                            id={titleId}
                            className="relative text-4xl 2xl:text-5xl text-secondary 2xl:leading-snug pb-6 md:after:absolute md:after:right-0 md:after:bottom-0 md:after:h-[3px] md:after:w-[calc(133%_+_5.5rem)] 2xl:after:w-[calc(150%_+_6.375rem)] md:after:bg-secondary md:before:absolute md:before:left-[calc(-33%_-_5.5rem)] 2xl:before:left-[calc(-50%_-_6.375rem)] md:before:-translate-x-1/2 md:before:-bottom-3 md:before:w-6 md:before:h-6 md:before:rounded-full md:before:bg-secondary"
                        >
                            <span className="inline-block max-w-xl">
                                {content.titulo}
                            </span>
                        </h2>

                        {content.imagem && (
                            <img
                                src={content.imagem}
                                alt={content.imagem_alt || content.titulo || 'Origem da Pizzato Vinhas e Vinhos'}
                                loading="lazy"
                                decoding="async"
                                className="block mt-10 mb-10 2xl:mb-14"
                            />
                        )}

                        {content.texto && (
                            <div
                                className="font-secondary"
                                dangerouslySetInnerHTML={{ __html: content.texto }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};