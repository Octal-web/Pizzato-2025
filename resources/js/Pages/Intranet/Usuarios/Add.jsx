import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowLeft, 
    faSave,
    faUser,
    faEnvelope,
    faLock,
    faUserShield
} from '@fortawesome/free-solid-svg-icons';

import IntranetLayout from '@/Layouts/IntranetLayout';

export default function Add() {
    const { data, setData, post, processing, errors } = useForm({
        nome: '',
        email: '',
        password: '',
        password_confirmation: '',
        admin: false
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('Intranet.Membros.novo'));
    };

    return (
        <IntranetLayout>
            <section className="min-h-[calc(100vh_-_119px)]">
                <div className="container max-w-large">
                    <div className="py-10">
                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <Link
                                    href={route('Intranet.Membros.index')}
                                    className="text-gray-600 hover:text-gray-800 mr-4"
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
                                </Link>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Novo Usuário
                                </h1>
                            </div>
                            <p className="text-gray-600">
                                Crie um novo usuário do sistema.
                            </p>
                        </div>

                        <div className="bg-white rounded shadow">
                            <form onSubmit={handleSubmit} className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                                            <FontAwesomeIcon icon={faUser} className="mr-2" />
                                            Nome
                                        </label>
                                        <input
                                            type="text"
                                            id="nome"
                                            value={data.nome}
                                            onChange={(e) => setData('nome', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.nome ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Digite o nome completo"
                                        />
                                        {errors.nome && (
                                            <p className="mt-1 text-sm text-red-600">{errors.nome}</p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                                            E-mail
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Digite o e-mail"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                            <FontAwesomeIcon icon={faLock} className="mr-2" />
                                            Senha
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.password ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Digite a senha"
                                        />
                                        {errors.password && (
                                            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                                            <FontAwesomeIcon icon={faLock} className="mr-2" />
                                            Confirmar Senha
                                        </label>
                                        <input
                                            type="password"
                                            id="password_confirmation"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Confirme a senha"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="admin"
                                                checked={data.admin}
                                                onChange={(e) => setData('admin', e.target.checked)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="admin" className="ml-2 block text-sm text-gray-700">
                                                <FontAwesomeIcon icon={faUserShield} className="mr-2" />
                                                Usuário Administrador
                                            </label>
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">
                                            Administradores têm acesso total ao sistema
                                        </p>
                                        {errors.admin && (
                                            <p className="mt-1 text-sm text-red-600">{errors.admin}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end space-x-4">
                                    <Link
                                        href={route('Intranet.Membros.index')}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 transition-colors disabled:opacity-50"
                                    >
                                        <FontAwesomeIcon icon={faSave} className="mr-2" />
                                        {processing ? 'Salvando...' : 'Salvar Usuário'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </IntranetLayout>
    );
}