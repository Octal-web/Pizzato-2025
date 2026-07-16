import React, { useState } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWineBottle, faList, faSave, faArrowLeft, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

import AdminLayout from '@/Layouts/AdminLayout';
import { Breadcrumb } from '@/Components/Manager/Breadcrumb';
import { FormGroup } from '@/Components/Manager/Inputs/FormGroup';
import { InputText } from '@/Components/Manager/Inputs/InputText';
import { InputFileDropzone } from '@/Components/Manager/Inputs/InputFileDropzone';

const Page = () => {
    const { idioma, idiomas, produto, volumes, linhas, categorias } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        ...produto,
        arq: produto.arquivos && produto.arquivos.length > 0 
            ? produto.arquivos.map(a => ({ ...a, arquivo: null }))
            : [{ id: null, titulo: '', arquivo: null }]
    });
    
    const breadcrumbItems = [
        { label: 'Produtos', link: 'Manager.Produtos.index' },
    ];

    const inputItems = [
        [{ titulo: 'Nome', name: 'nome', tamanho: 'col-span-12 md:col-span-6 lg:col-span-4', tipo: 'texto', max: 120 }, { titulo: 'Volumes', name: 'produtos_volumes', tamanho: 'col-span-12 lg:col-span-4', tipo: 'select', isMulti: true, options: volumes }],
        [{ titulo: 'Linha', name: 'linha_id', tamanho: 'col-span-12 md:col-span-6 lg:col-span-4', tipo: 'select', options: linhas }, { titulo: 'Categoria', name: 'categoria_id', tamanho: 'col-span-12 md:col-span-6 lg:col-span-4', tipo: 'select', options: categorias }],
        [{ titulo: 'Link Loja', name: 'link_loja', tamanho: 'col-span-12 md:col-span-6 lg:col-span-4', tipo: 'link' }, { titulo: 'Colheitas', name: 'colheitas', tamanho: 'col-span-12 md:col-span-6 lg:col-span-4', tipo: 'texto', max: 60 }],
        [{ titulo: 'Descrição', name: 'descricao', tamanho: 'col-span-12 lg:col-span-8', tipo: 'texto_longo', editor: true, 'toolbar': ['Bold', 'Italic', 'List', 'Image', 'Table'], max: 1080 }],
        [{ titulo: 'Destaques', name: 'destaques', tamanho: 'col-span-12 lg:col-span-8', tipo: 'texto_longo', editor: true, 'toolbar': ['Bold', 'Italic', 'List'], max: 1080 }],
        [{ titulo: 'Imagem', name: 'img', tamanho: 'col-span-12 md:col-span-6', tipo: 'imagem', crop: true, largura: 960, altura: 880, imagem: produto.imagem }, { titulo: 'Destaque', name: 'destaque', tamanho: 'col-span-2', tipo: 'check' }],
        [{ titulo: 'Imagem Fundo', name: 'img_bg', tamanho: 'col-span-12 md:col-span-6', tipo: 'imagem', crop: true, largura: 540, altura: 700, imagem: produto.imagem_fundo }, { titulo: 'Imagem infinito', name: 'img_full', tamanho: 'col-span-12 md:col-span-6 lg:col-span-4', tipo: 'imagem', crop: false, largura: 300, altura: 1000, imagem: produto.imagem_infinito }],
        [{ titulo: 'Título página', name: 'titulo_pagina', tamanho: 'col-span-12 lg:col-span-8', tipo: 'texto', max: 70 }],
        [{ titulo: 'Descrição página', name: 'descricao_pagina', tamanho: 'col-span-12 lg:col-span-8', tipo: 'texto_longo', 'editor': false, max: 220 }]
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        const idioma_url = new URLSearchParams(window.location.search).get('lang');

        post(route('Manager.Produtos.atualizar', {id: produto.id, lang: idioma_url}), {
            preserveScroll: true,
        });
    };

    const onChange = (name, value) => {
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleImageCrop = (croppedImage, fileExtenstion, name) => {
        setData(prevData => ({
            ...prevData,
            [name]: croppedImage
        }));
    };

    const addArquivo = () => {
        setData('arq', [...data.arq, { id: null, titulo: '', arquivo: null }]);
    };

    const removeArquivo = (index) => {
        const arquivo = data.arq[index];
        
        if (arquivo.id) {
            const newArquivos = [...data.arq];
            newArquivos[index] = { ...arquivo, _deleted: true };
            setData('arq', newArquivos);
        } else {
            const newArquivos = data.arq.filter((_, i) => i !== index);
            setData('arq', newArquivos.length > 0 ? newArquivos : [{ id: null, titulo: '', arquivo: null }]);
        }
    };

    const handleArquivoChange = (index, field, value) => {
        const newArquivos = [...data.arq];
        newArquivos[index][field] = value;
        setData('arq', newArquivos);
    };
    
    return (
        <AdminLayout>
            <Breadcrumb icon={faWineBottle} items={breadcrumbItems} current="Editar" idioma={idioma.codigo} idiomas={idiomas} id={produto.id} />

            <div className="mb-6 rounded-sm border border-stroke bg-white px-5 py-5 shadow-md">
                <Link
                    href={route('Manager.Produtos.Detalhes.index', {id: produto.id})}
                    className="flex items-center border border-stroke bg-white px-3 py-2 float-right rounded-md transition-all hover:bg-slate-100 ml-2"
                >   
                    <FontAwesomeIcon icon={faList} className="text-slate-700 mr-2" />
                    Detalhes
                </Link>

                <div className="mt-12">
                    <div onSubmit={handleSubmit}>
                        {inputItems.map((group, groupIndex) => (
                            <div key={groupIndex} className="grid grid-cols-12 gap-x-6">
                                {group.map((input, index) => (
                                    <div key={index} className={`w-full ${input.tamanho}`}>
                                        <FormGroup
                                            input={input}
                                            idioma={idioma}
                                            value={data[input.name]}
                                            onChange={onChange}
                                            handleImageCrop={handleImageCrop}
                                        />
                                        {errors[input.name] && <p className="text-sm text-red-500 -mt-5 mb-3">{errors[input.name]}</p>}
                                    </div>
                                ))}
                            </div>
                        ))}

                        <div className="flex items-center justify-between border-b pb-2 mb-6 mt-8">
                            <label className="block font-bold text-gray-500">Arquivos</label>
                            <button
                                type="button"
                                onClick={addArquivo}
                                className="flex items-center text-sm bg-green-600 text-white px-3 py-1 rounded-md transition-all hover:bg-green-700"
                            >
                                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                Adicionar Arquivo
                            </button>
                        </div>

                        <div>
                            {data.arq.filter(a => !a._deleted).map((arquivo, index) => {
                                const realIndex = data.arq.indexOf(arquivo);
                                
                                return (
                                <div key={realIndex} className="mb-6 p-4 border-b last:border-none border-gray-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-gray-700">Arquivo {index + 1}</h3>
                                        {index !== 0 && (
                                            <button
                                                type="button"
                                                onClick={() => removeArquivo(realIndex)}
                                                className="flex items-center text-sm bg-red-600 text-white px-3 py-1 rounded-md transition-all hover:bg-red-700"
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                                                Remover
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-12 gap-x-6">
                                        <div className="w-full col-span-12 md:col-span-6 lg:col-span-4">
                                            <InputText
                                                title="Título do Arquivo"
                                                name={`arq_titulo_${realIndex}`}
                                                max="30"
                                                value={arquivo.titulo || ''}
                                                idioma={idioma.codigo}
                                                onChange={(name, value) => handleArquivoChange(realIndex, 'titulo', value)}
                                            />
                                            {errors[`arq.${realIndex}.titulo`] && (
                                                <p className="text-sm text-red-500 -mt-5 mb-3">
                                                    {errors[`arq.${realIndex}.titulo`]}
                                                </p>
                                            )}
                                        </div>
                                        
                                        <div className="w-full col-span-12 md:col-span-6 lg:col-span-4">
                                            <InputFileDropzone
                                                title="Arquivo"
                                                type="arquivo"
                                                name={`arq_file_${realIndex}`}
                                                value={arquivo.arquivo}
                                                onChange={(name, value) => handleArquivoChange(realIndex, 'arquivo', value)}
                                                currentFile={arquivo.id ? route('Manager.Produtos.baixarArquivo', { produto: produto.id, id: arquivo.id }) : null}
                                                onDelete={() => handleArquivoChange(realIndex, 'arquivo', null)}
                                            />
                                            {errors[`arq.${realIndex}.arquivo`] && (
                                                <p className="text-sm text-red-500 -mt-5 mb-3">
                                                    {errors[`arq.${realIndex}.arquivo`]}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )})}
                        </div>

                        <div className="flex items-center justify-end mt-8">
                            <Link href={route('Manager.Produtos.index')} className="flex items-center w-fit rounded-lg border border-red-700 text-red-700 px-3 py-2 mr-3 cursor-pointer transition-all hover:bg-red-100">
                                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                                Voltar
                            </Link>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={processing}
                                className="block relative w-fit rounded-lg border border-gray-300 px-3 py-2 cursor-pointer transition-all hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >   
                                <FontAwesomeIcon icon={faSave} className="text-slate-700 mr-2" />
                                {processing ? 'Salvando...' : 'Salvar'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Page;