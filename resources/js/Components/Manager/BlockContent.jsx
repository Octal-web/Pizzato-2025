import React, { useState, useEffect, useRef } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { ReactSortable } from "react-sortablejs";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { IndividualContent } from './IndividualContent';
import { IndividualItem } from './IndividualItem';

export const BlockContent = ({ content }) => {
    const itemsPerPage = 20;
    const [state, setState] = useState(content.conteudos);
    const previousStateRef = useRef(state);
    const [isUpdated, setIsUpdated] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showAll, setShowAll] = useState(false);

    const { data, setData, post } = useForm({});

    useEffect(() => {
        const previousState = previousStateRef.current;
        if (JSON.stringify(state) !== JSON.stringify(previousState)) {
            const orderedData = state.map((item, index) => ({
                id: item.id,
                ordem: index
            }));

            setData(prevData => ({ odr: orderedData }));
            setIsUpdated(true);
        }
        previousStateRef.current = state;
    }, [state]);

    useEffect(() => {
        if (isUpdated) {
            post(route('Manager.' + content.controller + '.ordenar'), {
                preserveScroll: true,
            });
            setIsUpdated(false);
        }
    }, [isUpdated]);

    const totalPages = Math.max(1, Math.ceil(state.length / itemsPerPage));
    const startIndex = showAll ? 0 : (currentPage - 1) * itemsPerPage;
    const visibleItems = showAll ? state : state.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const setVisibleItems = (items) => {
        if (showAll) {
            setState(items);
            return;
        }

        setState(current => {
            const updated = [...current];
            updated.splice(startIndex, visibleItems.length, ...items);
            return updated;
        });
    };

    const paginationItems = (() => {
        if (totalPages <= 4) {
            return Array.from({ length: totalPages }, (_, index) => index + 1);
        }

        if (currentPage <= 3) {
            return [1, 2, 3, 'ellipsis-end', totalPages];
        }

        if (currentPage >= totalPages - 2) {
            return [1, 'ellipsis-start', totalPages - 2, totalPages - 1, totalPages];
        }

        return [1, 'ellipsis-start', currentPage - 1, currentPage, currentPage + 1, 'ellipsis-end', totalPages];
    })();

    const pagination = state.length > itemsPerPage && (
        <div className="mt-8 flex flex-wrap items-center justify-end gap-2">
            {!showAll && (
                <>
                    <button type="button" onClick={() => setCurrentPage(page => Math.max(1, page - 1))} disabled={currentPage === 1} className="border border-stroke bg-white px-3 py-2 text-sm transition-all hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40">Anterior</button>
                    {paginationItems.map(item => typeof item === 'number' ? (
                        <button key={item} type="button" onClick={() => setCurrentPage(item)} aria-current={currentPage === item ? 'page' : undefined} className={`min-w-10 border px-3 py-2 text-sm transition-all ${currentPage === item ? 'border-secondary bg-secondary text-neutral-300' : 'border-stroke bg-white hover:bg-slate-100'}`}>{item}</button>
                    ) : (
                        <span key={item} aria-hidden="true" className="min-w-8 px-1 py-2 text-center text-sm text-slate-500">...</span>
                    ))}
                    <button type="button" onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages} className="border border-stroke bg-white px-3 py-2 text-sm transition-all hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40">Próxima</button>
                </>
            )}
            <button type="button" onClick={() => { setShowAll(value => !value); setCurrentPage(1); }} className="border border-stroke bg-white px-3 py-2 text-sm transition-all hover:bg-slate-100">{showAll ? 'Exibir 20 por página' : 'Exibir tudo'}</button>
        </div>
    );

    const slugify = (text) =>
    text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');
    
    return content.imagens ? (
        <div className="relative mb-6 border border-stroke bg-white px-5 py-5 shadow-md">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-black">{content.nome[0]}</h3>

                {content.addParametros && content.addParametros.length > 0 ? (
                    <div className="flex">
                        {content.addParametros.map((parameter, index) => (
                            <Link key={index} href={route(`Manager.${content.controller}.adicionar`, {tipo: slugify(parameter)})} className="flex items-center border border-stroke bg-white px-3 py-2 transition-all hover:bg-slate-100 ml-2">
                                <FontAwesomeIcon icon={faPlus} className="text-slate-700 mr-2" />
                                {`Adicionar ${parameter}`}
                            </Link>
                        ))}
                    </div>
                    ) : (
                    content.addId ? (
                        <Link href={route('Manager.' + content.controller + '.adicionar', { id: content.addId })} className="flex items-center border border-stroke bg-white px-3 py-2 transition-all hover:bg-slate-100 ml-2">
                            <FontAwesomeIcon icon={faPlus} className="text-slate-700 mr-2" />
                            {`Adicionar ${content.nome[1]}`}
                        </Link>
                        ) : (
                        <Link href={route('Manager.' + content.controller + '.adicionar')} className="flex items-center border border-stroke bg-white px-3 py-2 transition-all hover:bg-slate-100 ml-2">
                            <FontAwesomeIcon icon={faPlus} className="text-slate-700 mr-2" />
                            {`Adicionar ${content.nome[1]}`}
                        </Link>
                    )
                )}
            </div>

            <div className="mt-10">
                {content.editavel ? (
                    <ReactSortable
                        animation={150}
                        list={visibleItems}
                        forceFallback={true}
                        setList={setVisibleItems}
                        filter=".sort-ignore"
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-6 gap-y-4 sm:gap-y-8"
                    >
                        {visibleItems.map((conteudo, index) => (
                            <div key={conteudo.id} className="relative border border-stroke p-4 shadow-sm select-none before:content-[''] before:absolute before:top-0 before:left-0 before:bg-secondary before:w-full before:h-1 before:rounded-t-md">
                                <IndividualContent 
                                    individualContent={conteudo}
                                    imagensPath={content.imagensPath}
                                    imagensClass={content.imgClass}
                                    controller={content.controller}
                                    index={startIndex + index}
                                />
                            </div>
                        ))}
                    </ReactSortable>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-6 gap-y-4 sm:gap-y-8">
                        {visibleItems.map((conteudo, index) => (
                            <div key={conteudo.id} className="relative border border-stroke p-4 shadow-sm before:content-[''] before:absolute before:top-0 before:left-0 before:bg-secondary before:w-full before:h-1 before:rounded-t-md">
                                <IndividualContent 
                                    key={index}
                                    individualContent={conteudo}
                                    imagensPath={content.imagensPath}
                                    imagensClass={content.imgClass}
                                    controller={content.controller}
                                    index={startIndex + index}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {pagination}

            {isUpdated && (
                <div className="absolute inset-0 bg-white rounded-sm bg-opacity-50 flex items-center justify-center">
                    <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-solid border-black border-t-transparent"></div>
                </div>
            )}
        </div>
    ) : (
        <div className="mb-6 border border-stroke bg-white px-5 py-5 shadow-md">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-black">{content.nome[0]}</h3>

                {content.editavel && (
                    content.addParametros && content.addParametros.length > 0 ? (
                        <div className="flex">
                            {content.addParametros.map((parameter, index) => (
                                <Link key={index} href={route(`Manager.${content.controller}.adicionar`, {tipo: parameter})} className="flex items-center border border-stroke bg-white px-3 py-2 transition-all hover:bg-slate-100 ml-2">
                                    <FontAwesomeIcon icon={faPlus} className="text-slate-700 mr-2" />
                                    {`Adicionar ${parameter}`}
                                </Link>
                            ))}
                        </div>
                        ) : (
                        content.addId ? (
                            <Link href={route('Manager.' + content.controller + '.adicionar', { id: content.addId })} className="flex items-center border border-stroke bg-white px-3 py-2 transition-all hover:bg-slate-100 ml-2">
                                <FontAwesomeIcon icon={faPlus} className="text-slate-700 mr-2" />
                                {`Adicionar ${content.nome[1]}`}
                            </Link>
                            ) : (
                            <Link href={route('Manager.' + content.controller + '.adicionar')} className="flex items-center border border-stroke bg-white px-3 py-2 transition-all hover:bg-slate-100 ml-2">
                                <FontAwesomeIcon icon={faPlus} className="text-slate-700 mr-2" />
                                {`Adicionar ${content.nome[1]}`}
                            </Link>
                        )
                    )
                )}

            </div>

            <div className="mt-10 overflow-x-auto no-scrollbar">
                <table className="w-full min-w-[30rem] border-collapse">
                    <thead>
                        <tr>
                            <th className="border px-4 py-4 w-1/6 text-left">#</th>
                            <th className="border px-4 py-4 text-left">Valor</th>
                            <th className="border px-4 py-4 w-1/6 text-left">{content.editavel ? 'Visível' : 'Data' }</th>
                            <th className="border px-4 py-4 w-1/6 text-left">Ações</th>
                        </tr>
                    </thead>
                    {content.editavel ? (
                        <ReactSortable
                            animation={150}
                            list={visibleItems}
                            setList={setVisibleItems}
                            forceFallback={true}
                            tag="tbody"
                        >
                            {visibleItems.map((conteudo, index) => (
                                <IndividualItem 
                                    key={conteudo.id}
                                    individualContent={conteudo}
                                    imagensPath={content.imagensPath}
                                    imagensClass={content.imgClass}
                                    controller={content.controller}
                                    index={startIndex + index}
                                    edit={content.editavel}
                                />
                            ))}
                        </ReactSortable>
                    ) : (
                        visibleItems.map((conteudo, index) => (
                            <IndividualItem 
                                key={conteudo.id}
                                individualContent={conteudo}
                                imagensPath={content.imagensPath}
                                imagensClass={content.imgClass}
                                controller={content.controller}
                                index={startIndex + index}
                                edit={content.editavel}
                            />
                        ))
                    )}
                </table>
            </div>
            {pagination}
        </div>
    );
};
