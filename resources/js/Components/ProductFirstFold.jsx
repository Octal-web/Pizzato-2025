import { router } from "@inertiajs/react";
import { Reveal } from "./Reveal";

export const ProductFirstFold = ({
    line,
    name,
    image,
    description,
    volumes,
}) => {
    return (
        <section aria-labelledby="product-first-fold-title">
            <div className="md:flex items-center">
                <Reveal
                    className="md:w-1/2"
                    direction="left"
                    delay={router.activeVisit ? "0" : "15"}
                >
                    <img src={image} className="w-full" alt={name} />
                </Reveal>

                <Reveal
                    className="ml-auto md:w-1/2 my-10"
                    direction="right"
                    delay={router.activeVisit ? "0" : "15"}
                >
                    <div className="max-w-[52rem] md:pl-12 md:pr-[10%] max-md:mx-[5%]">
                        <img src={line} className="w-28 mb-2" alt={`Linha ${name}`} />
                        <h1
                            className="text-4xl sm:text-5xl md:text-6xl 2xl:text-7xl max-sm:tracking-tight text-secondary uppercase mb-8 md:mb-10"
                            id="product-first-fold-title"
                        >
                            {name}
                        </h1>
                        <div
                            className="font-secondary [&>p]:leading-relaxed max-md:[&>ul_li]:ml-2 [&>ul_li]:leading-relaxed md:[&>ul_li]:leading-loose [&>ul_li]:relative [&>ul_li]:pl-5 [&>ul_li]:before:content-[''] [&>ul_li]:before:absolute [&>ul_li]:before:w-2.5 [&>ul_li]:before:h-2.5 [&>ul_li]:before:left-0 [&>ul_li]:before:top-1/2 [&>ul_li]:before:bg-secondary [&>ul_li]:before:-translate-y-1/2"
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                        <h3 className="mt-8 font-secondary text-neutral-400">
                            Garrafas:
                        </h3>
                        <h4 className="text-3xl">{volumes}</h4>
                    </div>
                </Reveal>
            </div>
        </section>
    );
};
