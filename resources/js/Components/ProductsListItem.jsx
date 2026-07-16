import { Link } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";

import { useLang } from "@/hooks/useLang";

export const ProductsListItem = ({ product }) => {
    const lang = useLang();

    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const itemRef = useRef(null);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.matchMedia("(hover: none)").matches);
        };

        checkIsMobile();
        window.addEventListener("resize", checkIsMobile);

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (isMobile) {
                    setIsVisible(
                        entry.isIntersecting && entry.intersectionRatio >= 0.5,
                    );
                }
            },
            {
                threshold: 0.5,
                rootMargin: "0px",
            },
        );

        if (itemRef.current && isMobile) {
            observer.observe(itemRef.current);
        }

        return () => {
            window.removeEventListener("resize", checkIsMobile);
            if (itemRef.current) {
                observer.unobserve(itemRef.current);
            }
        };
    }, [isMobile]);

    return (
        <div ref={itemRef}>
            <Link
                href={route("Produtos.produto", { slug: product.slug })}
                className="group relative block h-0 pb-[calc(100%_*_2)] sm:pb-[calc(100%_*_9_/5)]"
            >
                <div
                    className={`absolute top-0 left-0 right-0 h-4/6 overflow-hidden transition-opacity duration-500 ${
                        isMobile && isVisible ? "opacity-100" : "opacity-0"
                    } group-hover:opacity-100`}
                >
                    <img
                        src={product.imagem_fundo}
                        className={`w-full h-full object-cover block transition-transform delay-300 group-hover:delay-0 group-hover:duration-[10000ms] ${
                            isMobile && isVisible ? "scale-125" : "scale-100"
                        } group-hover:scale-125`}
                        alt=""
                        aria-hidden="true"
                    />
                </div>
                <div
                    className="absolute bottom-0 left-0 right-0 h-2/6 bg-gradient-to-b from-black to-transparent opacity-10"
                    aria-hidden="true"
                />

                <div className="absolute max-[1450px]:bottom-[12%] bottom-[14%] left-1/2 transform -translate-x-1/2 z-[1]">
                    <img
                        src={product.imagem_infinito}
                        className={`max-h-[338px] max-[1290px]:max-w-[75px] max-[1450px]:max-w-[85px] max-[1290px]:max-h-[240px] max-[1450px]:max-h-[265px] object-cover max-w-[100px] transition-all duration-300 ${
                            isMobile && isVisible ? "scale-110" : "scale-100"
                        } group-hover:scale-110`}
                        alt=""
                    />

                    <div className="relative overflow-hidden h-[33.8px] max-md:-mb-3 -translate-y-1.5 max-md:mt-2">
                        <img
                            src={product.imagem_infinito}
                            className={`absolute max-h-[338px] max-[1290px]:max-h-[240px] max-[1450px]:max-h-[265px] object-cover max-[1290px]:max-w-[75px] max-[1450px]:max-w-[85px] max-w-[100px] transform scale-y-[-1] transition-all duration-300 ${
                                isMobile && isVisible
                                    ? "scale-110 scale-y-[-1.1]"
                                    : "scale-100 scale-y-[-1]"
                            } md:group-hover:opacity-0`}
                            style={{
                                maskImage:
                                    "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 5%, transparent 9%)",
                                WebkitMaskImage:
                                    "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 5%, transparent 9%)",
                            }}
                            alt=""
                            aria-hidden="true"
                        />
                    </div>
                </div>

                <h5
                    className={`absolute left-1 sm:left-2 right-1 sm:right-2 bottom-0 md:bottom-1 2xl:bottom-4 ${product.nome.length < 30 ? "mx-4 md:tracking-tight" : "mx-1"} lg:text-lg 2xl:text-xl text-center !leading-tight tracking-tighter uppercase transition-all translate-y-1/2 ${
                        isMobile && isVisible ? "opacity-75" : "opacity-100"
                    } group-hover:opacity-75`}
                >
                    {product.nome}
                </h5>
            </Link>
            <a
                href={product.link_loja}
                className="block w-fit font-secondary text-sm text-neutral-500 uppercase underline transition-all mx-auto mt-9 max-sm:mb-2 sm:mt-10 2xl:mt-8 hover:opacity-75"
                target="_blank"
                aria-label={`${lang("comprarAgora")} - ${product.nome} - ${lang("abreEmNovaAba")}`}
            >
                {lang("comprarAgora")}
            </a>
        </div>
    );
};
