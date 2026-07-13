import { useEffect, useState } from "react";
import { Reveal } from "./Reveal";

import { useLang } from "@/hooks/useLang";

export const ProductsCategories = ({ lines, categories, hasChanged }) => {
    const lang = useLang();

    const url = window.location.search;
    const urlParams = new URLSearchParams(url);
    const linhaUrl = urlParams.get("linha");
    const categoriaUrl = urlParams.get("categoria");

    const [linha, setLinha] = useState(() => {
        if (!linhaUrl && !categoriaUrl) {
            return String(lines[0].id);
        }
        return linhaUrl || null;
    });
    const [categoria, setCategoria] = useState(categoriaUrl);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLineChange = (event) => {
        setLinha(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setCategoria(event.target.value);
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        const currentUrl = new URL(window.location);

        if (linha) {
            currentUrl.searchParams.set("linha", linha);
            currentUrl.searchParams.delete("categoria");
            setCategoria(null);

            window.history.replaceState({}, "", currentUrl);

            hasChanged(true);
        }
    }, [linha]);

    useEffect(() => {
        const currentUrl = new URL(window.location);

        if (categoria) {
            currentUrl.searchParams.set("categoria", categoria);
            currentUrl.searchParams.delete("linha");
            setLinha(null);

            window.history.replaceState({}, "", currentUrl);

            hasChanged(true);
        }
    }, [categoria]);

    const FiltersContent = ({ isMobile = false }) => (
        <>
            <div className="mb-6">
                <h5 className="relative text-xl font-medium uppercase pb-3 after:content-[''] after:absolute after:bottom-2.5 after:left-0 after:w-6 after:h-[3px] after:bg-primary">
                    {lang("marcas")}
                </h5>
                <nav className="mt-1" aria-label={lang("marcas")}>
                    <ul className="space-y-1">
                        {lines.map((line) => (
                            <li key={line.id}>
                                <label className="flex items-center">
                                    <label className="relative flex mr-1.5">
                                        <input
                                            type="radio"
                                            name={
                                                isMobile
                                                    ? "linha-mobile"
                                                    : "linha"
                                            }
                                            value={line.id}
                                            onChange={handleLineChange}
                                            checked={linha === String(line.id)}
                                            className="peer border-primary checked:bg-white checked:border-primary checked:bg-[length:0_0] checked:hover:bg-white checked:hover:border-primary checked:focus:bg-white checked:focus:border-primary !outline-0 !ring-0 !ring-offset-0 after:checked:content-[''] checked:after:absolute checked:after:inset-2 checked:after:bg-primary"
                                        />
                                        <span
                                            className="peer-checked:content-[''] peer-checked:absolute peer-checked:inset-[3px] rounded-full peer-checked:bg-primary"
                                            aria-hidden="true"
                                        />
                                    </label>
                                    <span className="font-secondary text-sm whitespace-nowrap tracking-wide uppercase">
                                        {line.nome}
                                    </span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            <div>
                <h5 className="relative text-xl font-medium uppercase pb-3 after:content-[''] after:absolute after:bottom-2.5 after:left-0 after:w-6 after:h-[3px] after:bg-primary">
                    {lang("categorias")}
                </h5>
                <nav className="mt-1" aria-label={lang("categorias")}>
                    <ul className="space-y-1">
                        {categories.map((category) => (
                            <li key={category.id}>
                                <label className="flex items-center">
                                    <label className="relative flex mr-1.5">
                                        <input
                                            type="radio"
                                            name={
                                                isMobile
                                                    ? "categoria-mobile"
                                                    : "categoria"
                                            }
                                            value={category.id}
                                            onChange={handleCategoryChange}
                                            checked={
                                                categoria ===
                                                String(category.id)
                                            }
                                            className="peer border-primary checked:bg-white checked:border-primary checked:bg-[length:0_0] checked:hover:bg-white checked:hover:border-primary checked:focus:bg-white checked:focus:border-primary !outline-0 !ring-0 !ring-offset-0 after:checked:content-[''] checked:after:absolute checked:after:inset-2 checked:after:bg-primary"
                                        />
                                        <span
                                            className="peer-checked:content-[''] peer-checked:absolute peer-checked:inset-[3px] rounded-full peer-checked:bg-primary"
                                            aria-hidden="true"
                                        />
                                    </label>
                                    <span className="font-secondary text-sm whitespace-nowrap tracking-wide uppercase">
                                        {category.nome}
                                    </span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    );

    return (
        <>
            <div className="block w-fit ml-auto md:hidden mb-10">
                <button
                    onClick={toggleModal}
                    aria-expanded={isModalOpen}
                    aria-controls="products-filters-modal"
                    aria-haspopup="dialog"
                    className="w-full bg-primary text-white py-2 px-4 rounded-lg font-medium uppercase tracking-wide flex items-center justify-center gap-2"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                        />
                    </svg>
                    {lang("filtros")}
                </button>
            </div>

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 md:hidden"
                    id="products-filters-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="products-filters-modal-title"
                >
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50"
                        onClick={closeModal}
                    />

                    <div className="animate-slide-in-bottom fixed bottom-0 left-0 right-0 bg-white rounded-t-lg p-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3
                                className="text-lg font-medium uppercase"
                                id="products-filters-modal-title"
                            >
                                Filtros
                            </h3>
                            <button
                                onClick={closeModal}
                                aria-label={lang("fecharFiltros")}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <FiltersContent isMobile={true} />

                        <div className="mt-6 pt-4 border-t">
                            <button
                                onClick={closeModal}
                                className="w-full bg-primary text-white py-2 px-4 rounded-lg font-medium uppercase tracking-wide"
                            >
                                {lang("aplicarFiltros")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="hidden md:block">
                <Reveal direction="left">
                    <FiltersContent isMobile={false} />
                </Reveal>
            </div>
        </>
    );
};
