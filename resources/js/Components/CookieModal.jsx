import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

const setCookie = (name, value, days) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
    };

    const getCookie = (name) => {
        return document.cookie.split('; ').reduce((r, v) => {
            const parts = v.split('=');
            return parts[0] === name ? decodeURIComponent(parts[1]) : r;
        }, '');
    };

export const CookieModal = ({ acceptCookies, visible }) => {
    const [showModal, setShowModal] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        const notifyCookies = getCookie('notify-cookies');
        if (notifyCookies === '1') {
            setShowModal(false);
        }
    }, []);


    useEffect(() => {
        const notifyCookies = getCookie('notify-cookies');
        if (notifyCookies === '1') {
            setShowModal(false);
        }
    }, []);

    const handleAcceptCookies = () => {
        setCookie('notify-cookies', '1', 365);
        setIsFadingOut(true);
        acceptCookies();
        setTimeout(() => {
            setShowModal(false);
        }, 200);
    };

    return (
        <>
            {showModal && visible ? (
                <div className={`fixed bottom-0 left-0 right-0 z-[999] ${isFadingOut ? 'animate-fade-out-down' : ''}`}>
                    <div className="container max-w-large">
                        <div className="bg-white px-6 md:px-8 py-6 shadow-md mb-10">
                            <div className="font-secondary tracking-tight sm:tracking-normal text-sm sm:text-base">
                                <p>
                                Utilizamos cookies para oferecer uma melhor experiência, melhorar o desempenho, analisar como você interage em nosso site e personalizar conteúdo. Para mais informações acesse nossa{' '} 
                                <Link href={route('Politicas.privacidade')} className="underline">política de privacidade</Link>.
                                </p>
                            </div>
                            <button
                                onClick={handleAcceptCookies}
                                className="font-secondary w-full sm:w-fit bg-primary text-sm sm:text-base text-white md:ml-auto px-6 mt-6 whitespace-nowrap block text-center h-10 sm:h-12 2xl:h-14 flex items-center justify-center tracking-wide uppercase transition-all hover:bg-opacity-75"
                            >
                            Aceitar todos os cookies
                          </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};