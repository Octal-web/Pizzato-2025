import { Reveal } from "./Reveal";

export const ProductDetails = ({ details }) => {
    return (
        <section className="py-16 md:py-30">
            <div className="container max-w-large">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-24 gap-y-8 md:gap-y-16">
                    {details.map((detail, index) => (
                        <Reveal
                            className="flex flex-col sm:flex-row items-start gap-2 sm:gap-8"
                            direction="bottom"
                            key={index}
                            delay={index}
                        >
                            <img
                                src={detail.icone}
                                className="flex-shrink-0 w-12 h-12 sm:w-auto sm:h-auto"
                                alt=""
                                aria-hidden="true"
                            />
                            <div>
                                <h3 className="text-secondary text-2xl md:text-3xl uppercase mb-2">
                                    {detail.nome}
                                </h3>
                                <div
                                    className="font-secondary text-sm sm:text-base leading-snug max-w-[450px] md:[&_table_td]:w-1/2 md:[&_table]:-mr-20"
                                    dangerouslySetInnerHTML={{
                                        __html: detail.conteudo,
                                    }}
                                />
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};
