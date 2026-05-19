import React, { useEffect, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';

import { useLang } from "@/hooks/useLang";

import { Reveal } from './Reveal';

export const HomeNewsletter = ({ content }) => {
    const lang = useLang();

    const { message } = usePage().props;

    const [aware, setAware] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSuccessful, setIsSuccessful] = useState(false);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        email: '',
        politica: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors();
        setLoading(true);

        post(route('Newsletter.enviar'), {
            preserveScroll: true,
            onSuccess: () => {
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            }
        });
    };

    const handleAware = (e) => {
        setAware(!aware);
        handleChange(e);
    };

    useEffect(() => {  
        if (message && message.type === 'newsSuccess') {
            setIsSuccessful(true);

            setTimeout(() => {
                setData({
                    email: '',
                });

                setIsSuccessful(false);
                setAware(false);
            }, 2000);
        }
    }, [message]);

    return (
        <section className="relative mt-20 md:mt-30">
            <Reveal className="w-full md:w-3/5 ml-auto max-sm:aspect-square" direction="right">
                <img src={content.imagem} className="w-full h-full object-cover" />
            </Reveal>

            <Reveal className="absolute inset-0" direction="left">
                <div className="container max-w-large h-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center h-full">
                        <div className="bg-primary max-md:bg-opacity-70 py-8 px-10 lg:py-12 lg:px-16 2xl:p-20">
                            <h4 className="max-w-md relative text-secondary text-3xl lg:text-[44px] leading-none mt-2 mb-3">{content.titulo}</h4>
                            <h6 className="font-secondary text-white">{content.subtitulo}</h6>

                            <div className="mt-5 lg:mt-8">
                                <form className="w-full font-secondary" onSubmit={handleSubmit}>
                                    <div className="w-full mb-4">
                                        <div className="relative">
                                            <input type="text" id="email" name="email" value={data.email} onChange={handleChange} placeholder="Digite seu e-mail" className="w-full h-12 2xl:h-14 md:px-8 py-2 border border-primary focus:ring-primary focus:border-primary placeholder-gray-300" />

                                            <button
                                                type="submit"
                                                className={`absolute right-1.5 2xl:right-2 top-1.5 2xl:top-2 bottom-1.5 2xl:bottom-2 bg-secondary text-white font-medium tracking-wide lg:tracking-[3px] uppercase py-1 px-5 transition-all ${!aware ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-75'}`}
                                                disabled={!aware && true}
                                            >
                                                <span className={`${loading || isSuccessful ? 'opacity-0' : ''}`}>{lang('enviar')}</span>

                                                {loading && (
                                                    <div role="status" className="absolute inset-0 flex justify-center items-center">
                                                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-secondary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                                        </svg>
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                )}

                                                {isSuccessful && (
                                                    <span className="absolute inset-0 flex items-center justify-center">
                                                        <span className="block w-5 h-6 relative">
                                                            <span className="absolute top-0 left-0 w-2.5 h-4 border-r-2 border-b-2 border-white transform rotate-45 translate-x-1.5 translate-y-0.5" />
                                                        </span>
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                        {errors.email && <p className="text-red-500 mt-2">{errors.email}</p>}
                                    </div>

                                    <div className="w-full">
                                        <div className="flex items-center">
                                            <input type="checkbox" name="politica" id="politica" className="relative aspect-square w-5 h-5 cursor-pointer appearance-none rounded-full border-0 after:absolute after:top-1/2 after:left-1/2 after:aspect-square after:h-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-transparent after:checked:bg-primary checked:bg-none checked:text-white focus:ring-offset-0 focus:ring-0" checked={data.politica} onChange={handleAware} />
                                            <label htmlFor="politica" className="ml-2 block max-lg:text-sm text-white">{lang('liEAceito')} <a href={route('Politicas.privacidade')} className="lowercase underline" target="_blank">{lang('politicaPrivacidade')}</a>.</label>
                                        </div>
                                        {errors.politica && <p className="text-white bg-red-500 bg-opacity-40 px-8 py-1 mx-5 rounded-full w-fit">{errors.politica}</p>}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </Reveal>
        </section>
    );
};
