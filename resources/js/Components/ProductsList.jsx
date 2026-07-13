import { useState } from "react";

import { ProductsListItem } from "./ProductsListItem";

export const ProductsList = ({ hasAside = true, line, category, loading }) => {
    const url = window.location.search;
    const urlParams = new URLSearchParams(url);
    const linhaUrl = urlParams.get("linha");
    const categoriaUrl = urlParams.get("categoria");
    const [linha, setLinha] = useState(linhaUrl);
    const [categoria, setCategoria] = useState(categoriaUrl);

    return (
        <section
            className={`w-full pb-4 ${hasAside ? "md:ml-8 md:pl-14 md:border-l md:border-neutral-300" : "md:mr-8 md:pr-14 max-w-[1300px]"}`}
            aria-live="polite"
            aria-busy={loading ? "true" : "false"}
        >
            {line && (
                <>
                    <div className="space-y-16 2xl:space-y-20">
                        {line.produtos.map((category, index) => (
                            <div className="mb-4" key={index}>
                                <h5 className="flex items-center gap-6 text-2xl whitespace-nowrap after:content-[''] after:w-full after:border-t after:border-neutral-300 after:mt-2">
                                    {category.categoria}
                                </h5>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-10 lg:gap-12 mt-6">
                                    {category.produtos.map((product) => (
                                        <ProductsListItem
                                            product={product}
                                            key={product.id}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {!line && category && (
                <div className="space-y-16 2xl:space-y-20">
                    {category.produtos.map((category, index) => (
                        <div className="mb-4" key={index}>
                            <h5 className="flex items-center gap-6 text-2xl whitespace-nowrap after:content-[''] after:w-full after:border-t after:border-neutral-300 after:mt-2">
                                {"LINHA " + category.linha}
                            </h5>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-10 lg:gap-12 mt-6">
                                {category.produtos.map((product) => (
                                    <ProductsListItem
                                        product={product}
                                        key={product.id}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};
