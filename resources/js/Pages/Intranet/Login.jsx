import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';

import { FlashMessage } from '@/Components/Intranet/FlashMessage';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const { message } = usePage().props;

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
        clearErrors(name);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors();

        post(route('Intranet.login'), {
            preserveScroll: true,
        });
    };

    const currentYear = new Date().getFullYear();

    return (
        <>
            <Head>
                <title>Pizzato | Manager</title>
                <link rel="icon" href={`/favicon.ico`} type="image/x-icon" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <div className="">
                            <img src="/admin/img/logo.png" className="invert mx-auto" />
                        </div>
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">
                            Acesso à Intranet
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Entre com suas credenciais para acessar o sistema
                        </p>
                    </div>
                    
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <div className="space-y-6">
                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                                            </svg>
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={data.email}
                                            onChange={handleChange}
                                            className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-neutral-500 focus:ring-neutral-500'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm transition duration-200`}
                                            placeholder="seu@email.com"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center">
                                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                        Senha
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                            </svg>
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={data.password}
                                            onChange={handleChange}
                                            className={`block w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-neutral-500 focus:ring-neutral-500'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm transition duration-200`}
                                            placeholder="••••••••"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition duration-200"
                                            >
                                                {showPassword ? (
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                                                    </svg>
                                                ) : (
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center">
                                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center !mb-8">
                                    <input
                                        id="remember"
                                        name="remember"
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-neutral-600 focus:ring-neutral-500 border-gray-300 rounded transition duration-200"
                                    />
                                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                        Lembrar-me
                                    </label>
                                </div>
                            </div>
     
                            {message && (
                                <FlashMessage type={message.type} message={message.message} />
                            )}

                            <div className="">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition duration-200 ${
                                        processing 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-neutral-800 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                                    }`}
                                >
                                    {processing && (
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    {processing ? 'Entrando...' : 'Entrar'}
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="text-center">
                        <p className="text-xs text-gray-500">
                            &copy; {currentYear} Pizzato. Desenvolvido por Octal Web.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}