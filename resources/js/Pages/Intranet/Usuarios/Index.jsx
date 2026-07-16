import React, { useState } from 'react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPlus, 
    faSearch, 
    faEdit, 
    faTrash, 
    faEye, 
    faUserShield,
    faUser,
    faSort,
    faSortUp,
    faSortDown,
    faFilter
} from '@fortawesome/free-solid-svg-icons';

import IntranetLayout from '@/Layouts/IntranetLayout';
import { ConfirmModal } from '@/Components/Intranet/ConfirmModal';
import Pagination from '@/Components/Intranet/Pagination';

export default function Index({ usuarios, filters }) {
    const { auth } = usePage().props;
    const [confirmModal, setConfirmModal] = useState(null);
    
    const { data, setData, get, processing } = useForm({
        search: filters.search || '',
        admin_filter: filters.admin_filter || '',
        sort: filters.sort || 'nome',
        direction: filters.direction || 'asc'
    });

    const closeModal = () => {
        setConfirmModal(null);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        get(route('Intranet.Membros.index'), {
            preserveState: true,
            only: ['usuarios']
        });
    };

    const handleSort = (column) => {
        const newDirection = data.sort === column && data.direction === 'asc' ? 'desc' : 'asc';
        setData({
            ...data,
            sort: column,
            direction: newDirection
        });
        
        get(route('admin.usuarios.index'), {
            preserveState: true,
            only: ['usuarios'],
            data: {
                ...data,
                sort: column,
                direction: newDirection
            }
        });
    };

    const handleDelete = (usuario) => {
        setConfirmModal({
            type: 'delete',
            data: { file: usuario },
            action: () => {
                router.delete(route('admin.usuarios.destroy', usuario.id));
            }
        });
    };

    const handleToggleAdmin = (usuario) => {
        const action = usuario.admin ? 'remover privilégios' : 'tornar administrador';
        setConfirmModal({
            type: 'toggleAdmin',
            data: { usuario, action },
            action: () => {
                router.patch(route('Intranet.Membros.mudarAdmin', usuario.id));
            }
        });
    };

    const getSortIcon = (column) => {
        if (data.sort !== column) return faSort;
        return data.direction === 'asc' ? faSortUp : faSortDown;
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
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Gerenciar Usuários
                            </h1>
                            <p className="text-gray-600">
                                Gerencie os usuários do sistema, suas permissões e informações.
                            </p>
                        </div>

                        {/* Actions Bar */}
                        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                            <Link
                                href={route('Intranet.Membros.adicionar')}
                                className="px-4 py-2 bg-neutral-800 text-white border-0 rounded cursor-pointer hover:bg-neutral-700 transition-colors"
                            >
                                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                Novo Usuário
                            </Link>

                            {/* Filters and Search */}
                            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={data.search}
                                        onChange={(e) => setData('search', e.target.value)}
                                        placeholder="Buscar por nome ou email..."
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[250px]"
                                    />
                                    <FontAwesomeIcon 
                                        icon={faSearch} 
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    />
                                </div>

                                <select
                                    value={data.admin_filter}
                                    onChange={(e) => setData('admin_filter', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Todos os usuários</option>
                                    <option value="admin">Apenas admins</option>
                                    <option value="user">Apenas usuários</option>
                                </select>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors disabled:opacity-50"
                                >
                                    <FontAwesomeIcon icon={faFilter} className="mr-2" />
                                    Filtrar
                                </button>
                            </form>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded shadow overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th 
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleSort('nome')}
                                            >
                                                <div className="flex items-center space-x-1">
                                                    <span>Nome</span>
                                                    <FontAwesomeIcon icon={getSortIcon('nome')} className="text-gray-400" />
                                                </div>
                                            </th>
                                            <th 
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleSort('email')}
                                            >
                                                <div className="flex items-center space-x-1">
                                                    <span>Email</span>
                                                    <FontAwesomeIcon icon={getSortIcon('email')} className="text-gray-400" />
                                                </div>
                                            </th>
                                            <th 
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleSort('admin')}
                                            >
                                                <div className="flex items-center space-x-1">
                                                    <span>Tipo</span>
                                                    <FontAwesomeIcon icon={getSortIcon('admin')} className="text-gray-400" />
                                                </div>
                                            </th>
                                            <th 
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleSort('criado')}
                                            >
                                                <div className="flex items-center space-x-1">
                                                    <span>Criado em</span>
                                                    <FontAwesomeIcon icon={getSortIcon('criado')} className="text-gray-400" />
                                                </div>
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ações
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {usuarios.data.map((usuario) => (
                                            <tr key={usuario.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                                <FontAwesomeIcon 
                                                                    icon={usuario.admin ? faUserShield : faUser} 
                                                                    className={usuario.admin ? 'text-blue-600' : 'text-gray-600'} 
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {usuario.nome}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{usuario.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        usuario.admin 
                                                            ? 'bg-red-100 text-red-800' 
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {usuario.admin ? 'Administrador' : 'Usuário'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(usuario.criado)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <Link
                                                            href={route('Intranet.Membros.ver', usuario.id)}
                                                            className="text-blue-600 hover:text-blue-900 p-1"
                                                            title="Visualizar"
                                                        >
                                                            <FontAwesomeIcon icon={faEye} />
                                                        </Link>
                                                        
                                                        <Link
                                                            href={route('Intranet.Membros.editar', usuario.id)}
                                                            className="text-yellow-600 hover:text-yellow-900 p-1"
                                                            title="Editar"
                                                        >
                                                            <FontAwesomeIcon icon={faEdit} />
                                                        </Link>

                                                        <button
                                                            onClick={() => handleToggleAdmin(usuario)}
                                                            className={`p-1 ${
                                                                usuario.admin 
                                                                    ? 'text-orange-600 hover:text-orange-900' 
                                                                    : 'text-green-600 hover:text-green-900'
                                                            }`}
                                                            title={usuario.admin ? 'Remover admin' : 'Tornar admin'}
                                                        >
                                                            <FontAwesomeIcon icon={faUserShield} />
                                                        </button>

                                                        {usuario.id !== auth.user.id && (
                                                            <button
                                                                onClick={() => handleDelete(usuario)}
                                                                className="text-red-600 hover:text-red-900 p-1"
                                                                title="Deletar"
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {usuarios.data.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <FontAwesomeIcon icon={faUser} className="text-4xl mb-4" />
                                    <p>Nenhum usuário encontrado</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {usuarios.data.length > 0 && (
                            <div className="mt-6">
                                <Pagination links={usuarios.links} />
                            </div>
                        )}
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