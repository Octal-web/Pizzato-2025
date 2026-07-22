import React, { useState, useEffect, useRef } from 'react';
import { Link, useForm } from '@inertiajs/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faImage, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

import { InputText } from './Inputs/InputText';
import { InputTextArea } from './Inputs/InputTextArea';
import { InputTipTapEditor } from './Inputs/InputTipTapEditor';
import { InputFileImage } from './Inputs/InputFileImage';
import { InputLink } from './Inputs/InputLink';
import { InputFileDropzone } from './Inputs/InputFileDropzone';

const makeFormData = (content) => ({
    conteudosIdiomas: [
        {
            ...(content.titulo ? { titulo: content.titulo } : {}),
            ...(content.subtitulo ? { subtitulo: content.subtitulo } : {}),
            ...(content.texto ? { texto: content.texto } : {}),
            ...(content.link ? { link: content.link } : {}),
            ...(content.nova_aba !== undefined ? { nova_aba: content.nova_aba } : {}),
            ...(content.video ? { video: content.video } : {}),
            ...(content.arq ? { arquivo: content.arq } : {}),
        },
    ],
    ...(content.img ? { img: content.img } : {}),
});

export const FormContent = ({ content, full, toolbar, idioma, arqTipo = 'arquivo' }) => {
    const [currentContent, setCurrentContent] = useState(content);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [imageInputKey, setImageInputKey] = useState(0);

    const contentRef = useRef(null);
    const contentHeight = useRef('0px');

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm(makeFormData(content));

    useEffect(() => {
        setCurrentContent(content);
        setData(makeFormData(content));
    }, [content]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (contentRef.current) {
                contentHeight.current = `${contentRef.current.scrollHeight}px`;
            }

            setIsCollapsed(currentContent.minimizavel);
        }, 300);

        return () => clearTimeout(timeout);
    }, [currentContent]);

    const handleChange = (name, value) => {
        const [key, index, field] = name.split('.');

        setData((prevData) => {
            const updatedConteudosIdiomas = [...prevData.conteudosIdiomas];

            updatedConteudosIdiomas[index] = {
                ...updatedConteudosIdiomas[index],
                [field]: value,
            };

            return {
                ...prevData,
                conteudosIdiomas: updatedConteudosIdiomas,
            };
        });
    };

    const handleCheckboxChange = (name, checked) => {
        setData((prevData) => {
            const updatedConteudosIdiomas = [...prevData.conteudosIdiomas];

            updatedConteudosIdiomas[0] = {
                ...updatedConteudosIdiomas[0],
                [name]: checked,
            };

            return {
                ...prevData,
                conteudosIdiomas: updatedConteudosIdiomas,
            };
        });
    };

    const handleImageCrop = (file, extension, field = 'img') => {
        setData((prevData) => ({
            ...prevData,
            [field]: file,
        }));
    };

    const syncCurrentContentFallback = () => {
        setCurrentContent((prevContent) => ({
            ...prevContent,
            ...(data.conteudosIdiomas[0].titulo !== undefined ? { titulo: data.conteudosIdiomas[0].titulo } : {}),
            ...(data.conteudosIdiomas[0].subtitulo !== undefined ? { subtitulo: data.conteudosIdiomas[0].subtitulo } : {}),
            ...(data.conteudosIdiomas[0].texto !== undefined ? { texto: data.conteudosIdiomas[0].texto } : {}),
            ...(data.conteudosIdiomas[0].link !== undefined ? { link: data.conteudosIdiomas[0].link } : {}),
            ...(data.conteudosIdiomas[0].nova_aba !== undefined ? { nova_aba: data.conteudosIdiomas[0].nova_aba } : {}),
            ...(data.conteudosIdiomas[0].video !== undefined ? { video: data.conteudosIdiomas[0].video } : {}),
            ...(data.conteudosIdiomas[0].arquivo !== undefined ? { arq: data.conteudosIdiomas[0].arquivo } : {}),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const idioma_url = new URLSearchParams(window.location.search).get('lang');

        post(route('Manager.Conteudos.editar', { id: currentContent.id, lang: idioma_url }), {
            preserveScroll: true,
            preserveState: true,

            onSuccess: (page) => {
                const updatedContent = page.props.conteudos?.find((item) => item.id === currentContent.id);

                if (updatedContent) {
                    setCurrentContent(updatedContent);
                    setData(makeFormData(updatedContent));
                    setImageInputKey((current) => current + 1);
                    return;
                }

                syncCurrentContentFallback();
                setData(makeFormData(currentContent));
                setImageInputKey((current) => current + 1);
            },
        });
    };

    const toggleCollapse = () => {
        setIsCollapsed((prev) => !prev);
    };

    return (
        <div className={`mb-6 rounded-sm border border-stroke bg-white px-5 py-5 shadow-md ${currentContent.minimizavel && ' h-fit'}`}>
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-black">{currentContent.bloco}</h3>

                {currentContent.galeria && (
                    <Link
                        href={route('Manager.Imagens.conteudo', { id: currentContent.id })}
                        className="flex items-center border border-stroke bg-white px-3 py-2 rounded-md transition-all hover:bg-slate-100 ml-2"
                    >
                        <FontAwesomeIcon icon={faImage} className="text-slate-700 mr-2" />
                        Imagens
                    </Link>
                )}

                {currentContent.minimizavel && (
                    <button
                        type="button"
                        onClick={toggleCollapse}
                        className="relative block ml-auto mr-1 before:content-[''] before:absolute before:-top-1 before:-left-1.5 before:w-8 before:h-8 before:border before:rounded-full"
                    >
                        <FontAwesomeIcon icon={isCollapsed ? faChevronDown : faChevronUp} />
                    </button>
                )}
            </div>

            <div
                ref={contentRef}
                style={{ height: currentContent.minimizavel ? (isCollapsed ? '0px' : contentHeight.current) : 'auto' }}
                className="transition-all duration-300 ease-in-out overflow-hidden"
            >
                <div className="mt-10">
                    <form onSubmit={handleSubmit}>
                        {currentContent.habilitar_titulo && (
                            <div className="grid grid-cols-12 gap-x-6">
                                <div className={`col-span-12 ${full ? ' lg:col-span-8' : ''}`}>
                                    <InputText
                                        title="Título"
                                        name="conteudosIdiomas.0.titulo"
                                        value={data.conteudosIdiomas[0].titulo}
                                        idioma={idioma}
                                        onChange={(name, value) => handleChange(name, value)}
                                    />

                                    {errors['conteudosIdiomas.0.titulo'] && (
                                        <p className="text-sm text-red-500 -mt-5 mb-3">{errors['conteudosIdiomas.0.titulo']}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {currentContent.habilitar_subtitulo && (
                            <div className="grid grid-cols-12 gap-x-6">
                                <div className={`col-span-12 ${full ? ' lg:col-span-8' : ''}`}>
                                    <InputText
                                        title="Subtítulo"
                                        name="conteudosIdiomas.0.subtitulo"
                                        value={data.conteudosIdiomas[0].subtitulo}
                                        idioma={idioma}
                                        onChange={(name, value) => handleChange(name, value)}
                                    />

                                    {errors['conteudosIdiomas.0.subtitulo'] && (
                                        <p className="text-sm text-red-500 -mt-5 mb-3">{errors['conteudosIdiomas.0.subtitulo']}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {currentContent.habilitar_texto && (
                            <div className="grid grid-cols-12 gap-x-6">
                                <div className={`col-span-12 ${full ? ' lg:col-span-8' : ''}`}>
                                    {currentContent.texto_formatado ? (
                                        <InputTipTapEditor
                                            title="Texto"
                                            name="conteudosIdiomas.0.texto"
                                            toolbar={['Bold', 'Italic', ...(toolbar || [])]}
                                            value={data.conteudosIdiomas[0].texto}
                                            idioma={idioma}
                                            onChange={(name, content) => handleChange(name, content)}
                                        />
                                    ) : (
                                        <InputTextArea
                                            title="Texto"
                                            name="conteudosIdiomas.0.texto"
                                            value={data.conteudosIdiomas[0].texto}
                                            idioma={idioma}
                                            onChange={(name, value) => handleChange(name, value)}
                                        />
                                    )}

                                    {errors['conteudosIdiomas.0.texto'] && (
                                        <p className="text-sm text-red-500 -mt-5 mb-3">{errors['conteudosIdiomas.0.texto']}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {currentContent.habilitar_link && (
                            <div className="grid grid-cols-12 gap-x-6">
                                <div className={`col-span-12 ${full ? ' lg:col-span-8' : ''}`}>
                                    <InputLink
                                        title="Link"
                                        name="conteudosIdiomas.0.link"
                                        value={data.conteudosIdiomas[0].link}
                                        idioma={idioma}
                                        onChange={(name, value) => handleChange(name, value)}
                                        onCheck={(name, value) => handleCheckboxChange(name, value)}
                                        novaAba={data.conteudosIdiomas[0].nova_aba}
                                    />

                                    {errors['conteudosIdiomas.0.link'] && (
                                        <p className="text-sm text-red-500 -mt-5 mb-3">{errors['conteudosIdiomas.0.link']}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {currentContent.habilitar_video && (
                            <div className="grid grid-cols-12 gap-x-6">
                                <div className={`col-span-12 ${full ? ' lg:col-span-8' : ''}`}>
                                    <InputLink
                                        title="Vídeo"
                                        name="conteudosIdiomas.0.video"
                                        value={data.conteudosIdiomas[0].video}
                                        idioma={idioma}
                                        onChange={(name, value) => handleChange(name, value)}
                                    />

                                    {errors['conteudosIdiomas.0.video'] && (
                                        <p className="text-sm text-red-500 -mt-5 mb-3">{errors['conteudosIdiomas.0.video']}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {currentContent.habilitar_img && (
                            <div className="grid grid-cols-12 gap-x-6">
                                <div className={`col-span-12 ${full ? ' lg:col-span-8' : ''}`}>
                                    <InputFileImage
                                        key={`img-${currentContent.id}-${imageInputKey}`}
                                        title="Imagem"
                                        imagem={currentContent.imagem}
                                        name="img"
                                        size={{ largura: currentContent.largura_img, altura: currentContent.altura_img }}
                                        allowCrop={currentContent.recortar_img ? true : false}
                                        onImageCrop={handleImageCrop}
                                    />

                                    {errors['img'] && (
                                        <p className="text-sm text-red-500 -mt-5 mb-3">{errors['img']}</p>
                                    )}
                                </div>

                                {currentContent.habilitar_img_mobile && (
                                    <div className={`col-span-12 ${full ? ' lg:col-span-4' : ''}`}>
                                        <InputFileImage
                                            key={`img-mobile-${currentContent.id}-${imageInputKey}`}
                                            title="Imagem Mobile"
                                            name="img_mobile"
                                            imagem={currentContent.imagem_mobile}
                                            size={{ largura: currentContent.largura_img_mobile, altura: currentContent.altura_img_mobile }}
                                            allowCrop={currentContent.recortar_img_mobile ? true : false}
                                            onImageCrop={handleImageCrop}
                                        />

                                        {errors['img_mobile'] && (
                                            <p className="text-sm text-red-500 -mt-5 mb-3">{errors['img_mobile']}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {currentContent.habilitar_arq && (
                            <div className="grid grid-cols-12 gap-x-6">
                                <div className="col-span-12 lg:col-span-4">
                                    <InputFileDropzone
                                        title="Arquivo"
                                        name="conteudosIdiomas.0.arq"
                                        value={data.conteudosIdiomas[0].arq}
                                        idioma={idioma}
                                        onChange={(name, value) => handleChange(name, value)}
                                        type={arqTipo}
                                        currentFile={currentContent.arquivo}
                                        onDelete={() => handleChange('conteudosIdiomas.0.arq', null)}
                                    />

                                    {errors['arq'] && (
                                        <p className="text-sm text-red-500 -mt-5 mb-3">{errors['arq']}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="block relative w-fit rounded-lg border border-gray-300 px-3 py-2 cursor-pointer transition-all hover:bg-slate-200 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <FontAwesomeIcon icon={faSave} className="text-slate-700 mr-2" />
                                {processing ? 'Salvando...' : recentlySuccessful ? 'Salvo!' : 'Salvar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};