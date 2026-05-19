import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowLeft, 
    faSave,
    faUser,
    faEnvelope,
    faLock,
    faUserShield,
    faEye
} from '@fortawesome/free-solid-svg-icons';

import IntranetLayout from '@/Layouts/IntranetLayout';

export default function Edit({ usuario }) {
    const { data, setData, patch, processing, errors } = useForm({
        nome: usuario.nome || '',
        email: usuario.email || '',
        password: '',
        password_confirmation: '',
        admin: usuario.admin || false
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('Intranet.Membros.atualizar', usuario.id));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <IntranetLayout>
            <section className="min-h-[calc(100vh_-_119px)]">
                <div className="container max-w-large">
                    <div className="py-10">
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <Link
                                        href={route('Intranet.Membros.index')}
                                        className="text-gray-600 hover:text-gray-800 mr-4"
                                    >
                                        <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
                                    </Link>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        Editar Usuário
                                    </h1>
                                </div>
                                
                                <Link
                                    href={route('Intranet.Membros.ver', usuario.id)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faEye} className="mr-2" />
                                    Visualizar
                                </Link>
                            </div>
                            <p className="text-gray-600">
                                Edite as informações do usuário <strong>{usuario.nome}</strong>.
                            </p>
                        </div>

                        <div className="bg-white rounded shadow">
                            <form onSubmit={handleSubmit} className="p-6">
                                <div className="flex items-center mb-8 pb-6 border-b border-gray-200">
                                    <div className="flex-shrink-0 h-16 w-16 mr-4">
                                        <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                                            <FontAwesomeIcon 
                                                icon={usuario.admin ? faUserShield : faUser} 
                                                className={`text-xl ${usuario.admin ? 'text-blue-600' : 'text-gray-600'}`} 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {usuario.nome}
                                        </h3>
                                        <p className="text-gray-600">
                                            Criado em {formatDate(usuario.criado)}
                                        </p>
                                        {usuario.modificado && (
                                            <p className="text-gray-500 text-sm">
                                                Última modificação: {formatDate(usuario.modificado)}
                                            </p>
                                        )}
                                    </div>
                                </div>

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

                                    <div className="md:col-span-2 border-t border-gray-200 pt-6 mt-2">
                                        <h4 className="text-lg font-medium text-gray-900 mb-4">
                                            Alterar Senha (opcional)
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Deixe em branco para manter a senha atual.
                                        </p>
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                            <FontAwesomeIcon icon={faLock} className="mr-2" />
                                            Nova Senha
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.password ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Digite a nova senha (opcional)"
                                        />
                                        {errors.password && (
                                            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                                            <FontAwesomeIcon icon={faLock} className="mr-2" />
                                            Confirmar Nova Senha
                                        </label>
                                        <input
                                            type="password"
                                            id="password_confirmation"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Confirme a nova senha"
                                        />
                                    </div>

                                    <div className="md:col-span-2 border-t border-gray-200 pt-6">
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
                                    <Link
                                        href={route('Intranet.Membros.ver', usuario.id)}
                                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faEye} className="mr-2" />
                                        Visualizar
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 transition-colors disabled:opacity-50"
                                    >
                                        <FontAwesomeIcon icon={faSave} className="mr-2" />
                                        {processing ? 'Salvando...' : 'Salvar Alterações'}
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