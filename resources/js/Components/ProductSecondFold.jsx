import { useLang } from "@/hooks/useLang";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";

export const ProductSecondFold = ({
    id,
    features,
    image,
    color,
    harvest,
    files,
}) => {
    const lang = useLang();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <section
            className="relative max-md:mt-20 z-[1]"
            aria-labelledby="product-second-fold-title"
        >
            <div className="flex max-md:flex-col-reverse">
                <Reveal
                    className="md:w-1/2 mt-10 flex flex-col"
                    direction="right"
                >
                    <div className="md:ml-auto w-full py-10 my-auto max-w-[52rem] max-md:px-[5%] md:pr-12 md:pl-[10%]">
                        <h1
                            className="text-4xl sm:text-5xl md:text-6xl 2xl:text-7xl text-secondary uppercase mb-8 md:mb-14"
                            id="product-second-fold-title"
                        >
                            {lang("destaques")}
                        </h1>
                        <div
                            className="font-secondary"
                            dangerouslySetInnerHTML={{ __html: features }}
                        />

                        {files.length > 0 && (
                            <div
                                ref={dropdownRef}
                                className="mt-8 relative w-fit"
                            >
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="border-2 border-secondary py-3 px-4 sm:px-6 flex items-center gap-3 hover:bg-secondary/5 transition-colors"
                                    aria-expanded={isOpen}
                                    aria-controls="technical-files-dropdown"
                                >
                                    <span className="font-secondary text-secondary sm:text-lg lg:text-xl tracking-wide uppercase">
                                        {lang("fichaTecnica")}
                                    </span>
                                    <svg
                                        className={`w-5 h-5 text-secondary transition-transform ${isOpen ? "rotate-180" : ""}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>

                                {isOpen && (
                                    <div
                                        className="absolute z-10 -mt-0.5 min-w-full overflow-hidden w-fit"
                                        id="technical-files-dropdown"
                                    >
                                        <div className="border-2 border-secondary shadow-lg animate-fade-in-down duration-200">
                                            {files.map((file, index) => (
                                                <a
                                                    key={file.id}
                                                    className={`flex items-center justify-between bg-neutral-100 odd:bg-white py-3 px-3 sm:px-5 hover:bg-secondary transition-colors group ${index !== files.length - 1 ? "border-b border-secondary/30" : ""}`}
                                                    href={route(
                                                        "Produtos.download",
                                                        {
                                                            produto: id,
                                                            id: file.id,
                                                        },
                                                    )}
                                                >
                                                    <span className="font-secondary text-secondary sm:text-base group-hover:text-white transition-colors sm:whitespace-nowrap">
                                                        {file.titulo}
                                                    </span>
                                                    <svg
                                                        className="w-4 h-4 text-secondary group-hover:text-white transition-colors flex-shrink-0 ml-2"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                        />
                                                    </svg>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {harvest && (
                        <div className="bg-primary py-10 mt-16 md:mt-20">
                            <div className="ml-auto max-w-[52rem] max-md:px-[5%] md:pr-12 md:pl-[10%]">
                                <h5 className="relative text-2xl text-white font-medium uppercase pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-[3px] after:bg-white">
                                    {lang("colheitas")}
                                </h5>
                                <div className="text-secondary max-sm:tracking-tight text-2xl sm:text-3xl md:text-4xl mt-4">
                                    {harvest}
                                </div>
                            </div>
                        </div>
                    )}
                </Reveal>

                <Reveal className="md:w-1/2" direction="left">
                    {/* Imagem de apoio visual da seção sem descrição específica disponível neste componente. Caso exista descrição no banco, usar alt={imageDescription}. */}
                    <img src={image} className="w-full" alt="" />
                </Reveal>
            </div>
        </section>
    );
};
