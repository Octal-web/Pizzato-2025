import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowLeft, 
    faEdit, 
    faTrash,
    faUser,
    faEnvelope,
    faCalendar,
    faUserShield,
    faShieldAlt
} from '@fortawesome/free-solid-svg-icons';

import IntranetLayout from '@/Layouts/IntranetLayout';
import { ConfirmModal } from '@/Components/Intranet/ConfirmModal';

export default function Show({ usuario }) {
    const { auth } = usePage().props;
    const [confirmModal, setConfirmModal] = useState(null);

    const closeModal = () => {
        setConfirmModal(null);
    };

    const handleDelete = () => {
        setConfirmModal({
            type: 'delete',
            data: { file: usuario },
            action: () => {
                router.delete(route('admin.usuarios.destroy', usuario.id));
            }
        });
    };

    const handleToggleAdmin = () => {
        const action = usuario.admin ? 'remover privilégios' : 'tornar administrador';
        setConfirmModal({
            type: 'toggleAdmin',
            data: { usuario, action },
            action: () => {
                router.patch(route('Intranet.Membros.mudarAdmin', usuario.id));
            }
        });
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
                                        Visualizar Usuário
                                    </h1>
                                </div>
                                
                                <div className="flex space-x-3">
                                    <Link
                                        href={route('Intranet.Membros.editar', usuario.id)}
                                        className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                        Editar
                                    </Link>
                                    
                                    <button
                                        onClick={handleToggleAdmin}
                                        className={`px-4 py-2 rounded transition-colors ${
                                            usuario.admin 
                                                ? 'bg-orange-600 hover:bg-orange-700' 
                                                : 'bg-green-600 hover:bg-green-700'
                                        } text-white`}
                                    >
                                        <FontAwesomeIcon icon={faUserShield} className="mr-2" />
                                        {usuario.admin ? 'Remover Admin' : 'Tornar Admin'}
                                    </button>

                                    {usuario.id !== auth.user.id && (
                                        <button
                                            onClick={handleDelete}
                                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faTrash} className="mr-2" />
                                            Deletar
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded shadow">
                            <div className="p-6">
                                <div className="flex items-center mb-8 pb-6 border-b border-gray-200">
                                    <div className="flex-shrink-0 h-20 w-20 mr-6">
                                        <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                                            <FontAwesomeIcon 
                                                icon={usuario.admin ? faUserShield : faUser} 
                                                className={`text-2xl ${usuario.admin ? 'text-blue-600' : 'text-gray-600'}`} 
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-grow">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                            {usuario.nome}
                                        </h2>
                                        <div className="flex items-center space-x-4">
                                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                                                usuario.admin 
                                                    ? 'bg-red-100 text-red-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                <FontAwesomeIcon 
                                                    icon={usuario.admin ? faShieldAlt : faUser} 
                                                    className="mr-2" 
                                                />
                                                {usuario.admin ? 'Administrador' : 'Usuário'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Informações Pessoais
                                        </h3>
                                        
                                        <div className="space-y-4">
                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faUser} className="text-gray-400 w-5 mr-3" />
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-500">Nome</label>
                                                    <p className="text-gray-900">{usuario.nome}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 w-5 mr-3" />
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-500">E-mail</label>
                                                    <p className="text-gray-900">{usuario.email}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faShieldAlt} className="text-gray-400 w-5 mr-3" />
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-500">Tipo de Usuário</label>
                                                    <p className="text-gray-900">
                                                        {usuario.admin ? 'Administrador' : 'Usuário'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Informações do Sistema
                                        </h3>
                                        
                                        <div className="space-y-4">
                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faCalendar} className="text-gray-400 w-5 mr-3" />
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-500">Criado em</label>
                                                    <p className="text-gray-900">{formatDate(usuario.criado)}</p>
                                                </div>
                                            </div>

                                            {usuario.modificado && (
                                                <div className="flex items-center">
                                                    <FontAwesomeIcon icon={faCalendar} className="text-gray-400 w-5 mr-3" />
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-500">Última modificação</label>
                                                        <p className="text-gray-900">{formatDate(usuario.modificado)}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {usuario.excluido && (
                                                <div className="flex items-center">
                                                    <FontAwesomeIcon icon={faCalendar} className="text-red-400 w-5 mr-3" />
                                                    <div>
                                                        <label className="block text-sm font-medium text-red-500">Excluído em</label>
                                                        <p className="text-red-700">{formatDate(usuario.excluido)}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {usuario.admin && (
                                    <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded">
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faShieldAlt} className="text-red-600 mr-2" />
                                            <p className="text-red-800 font-medium">
                                                Este usuário possui privilégios de administrador
                                            </p>
                                        </div>
                                        <p className="text-red-700 text-sm mt-1">
                                            Administradores têm acesso total ao sistema e podem gerenciar outros usuários.
                                        </p>
                                    </div>
                                )}

                                {usuario.id === auth.user.id && (
                                    <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faUser} className="text-blue-600 mr-2" />
                                            <p className="text-blue-800 font-medium">
                                                Este é o seu usuário atual
                                            </p>
                                        </div>
                                        <p className="text-blue-700 text-sm mt-1">
                                            Você não pode deletar ou remover privilégios do seu próprio usuário.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {confirmModal && (
                <ConfirmModal
                    type={confirmModal.type}
                    data={confirmModal.data}
                    onConfirm={confirmModal.action}
                    onCancel={closeModal}
                />
            )}
        </IntranetLayout>
    );
}