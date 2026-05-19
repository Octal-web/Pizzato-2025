import { useState, useEffect } from 'react';
import { Reveal } from './Reveal';

export const ProductsCategories = ({ lines, categories }) => {
    const url = window.location.search;
    const urlParams = new URLSearchParams(url);
    const linhaUrl = urlParams.get('linha');
    const categoriaUrl = urlParams.get('categoria');
    const [linha, setLinha] = useState(linhaUrl);
    const [categoria, setCategoria] = useState(categoriaUrl);

    const handleLineChange = (clickedValue) => {
        if (linha === String(clickedValue)) {
            setLinha(null);
        } else {
            setLinha(String(clickedValue));
        }
    };

    const handleCategoryChange = (clickedValue) => {
        if (categoria === String(clickedValue)) {
            setCategoria(null);
        } else {
            setCategoria(String(clickedValue));
        }
    };

    useEffect(() => {
        const currentUrl = new URL(window.location);
        
        if (linha) {
            currentUrl.searchParams.set('linha', linha);
        } else {
            currentUrl.searchParams.delete('linha');
        }
        
        if (categoria) {
            currentUrl.searchParams.set('categoria', categoria);
        }
        
        window.history.replaceState({}, '', currentUrl);
    }, [linha, categoria]);

    return (
        <Reveal direction="left">
            <div className="mb-6">
                <h5 className="relative text-xl font-medium uppercase pb-3 after:content-[''] after:absolute after:bottom-2.5 after:left-0 after:w-6 after:h-[3px] after:bg-primary">Linhas</h5>
                <nav className="mt-1">
                    <ul className="space-y-1">
                        {lines.map((line) => (
                            <li key={line.id}>
                                <label className="flex items-center">
                                    <label 
                                        className="relative flex mr-1.5 cursor-pointer"
                                        onClick={() => handleLineChange(line.id)}
                                    >
                                        <input
                                            type="radio"
                                            name="linha"
                                            value={line.id}
                                            checked={linha === String(line.id)}
                                            readOnly
                                            className="peer border-primary checked:bg-white checked:border-primary checked:bg-[length:0_0] checked:hover:bg-white checked:hover:border-primary checked:focus:bg-white checked:focus:border-primary !outline-0 !ring-0 !ring-offset-0 after:checked:content-[''] checked:after:absolute checked:after:inset-2 checked:after:bg-primary"
                                        />
                                        <span className="peer-checked:content-[''] peer-checked:absolute peer-checked:inset-[3px] rounded-full peer-checked:bg-primary" />
                                    </label>
                                    <span className="text-sm tracking-wide uppercase">{line.nome}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            <div>
                <h5 className="relative text-xl font-medium uppercase pb-3 after:content-[''] after:absolute after:bottom-2.5 after:left-0 after:w-6 after:h-[3px] after:bg-primary">Categoria</h5>
                <nav className="mt-1">
                    <ul className="space-y-1">
                        {categories.map((category) => (
                            <li key={category.id}>
                                <label className="flex items-center">
                                    <label 
                                        className="relative flex mr-1.5 cursor-pointer"
                                        onClick={() => handleCategoryChange(category.id)}
                                    >
                                        <input
                                            type="radio"
                                            name="categoria"
                                            value={category.id}
                                            checked={categoria === String(category.id)}
                                            readOnly
                                            className="peer border-primary checked:bg-white checked:border-primary checked:bg-[length:0_0] checked:hover:bg-white checked:hover:border-primary checked:focus:bg-white checked:focus:border-primary !outline-0 !ring-0 !ring-offset-0 after:checked:content-[''] checked:after:absolute checked:after:inset-2 checked:after:bg-primary"
                                        />
                                        <span className="peer-checked:content-[''] peer-checked:absolute peer-checked:inset-[3px] rounded-full peer-checked:bg-primary" />
                                    </label>
                                    <span className="text-sm tracking-wide uppercase">{category.nome}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </Reveal>
    );
};