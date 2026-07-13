import { router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

import DefaultLayout from "@/Layouts/DefaultLayout";

import { ProductsBanner } from "@/Components/ProductsBanner";
import { ProductsCategories } from "@/Components/ProductsCategories";
import { ProductsList } from "@/Components/ProductsList";

const Page = () => {
    const { conteudos, linha, categoria, linhasMenu, categoriasMenu } =
        usePage().props;
    const [hasChanged, setHasChanged] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (hasChanged) {
            setLoading(true);

            const url = window.location.search;
            const urlParams = new URLSearchParams(url);
            const linhaUrl = urlParams.get("linha");
            const categoriaUrl = urlParams.get("categoria");

            const params = {};
            if (linhaUrl) params.linha = linhaUrl;
            if (categoriaUrl) params.categoria = categoriaUrl;

            router.get(window.location.href, params, {
                preserveState: true,
                preserveScroll: true,
                only: ["linha", "categoria"],
                onSuccess: () => {
                    setLoading(false);
                    setHasChanged(false);
                },
            });
        }
    }, [hasChanged]);

    return (
        <DefaultLayout>
            <ProductsBanner content={conteudos[0]} />
            <section
                className="mt-10 md:mt-20 mb-20 md:mb-30"
                aria-label={conteudos[0]?.titulo}
                aria-busy={loading ? "true" : "false"}
            >
                <div className="container max-w-large">
                    <div className="md:flex">
                        <ProductsCategories
                            lines={linhasMenu}
                            categories={categoriasMenu}
                            hasChanged={setHasChanged}
                        />
                        <ProductsList
                            hasAside={true}
                            line={linha}
                            category={categoria}
                            loading={loading}
                        />
                    </div>
                </div>
            </section>
        </DefaultLayout>
    );
};

export default Page;
