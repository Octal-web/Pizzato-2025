import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Head, Link, router } from '@inertiajs/react';
import { Menu, X, FileText, Users, LogOut } from 'lucide-react';

import { NotificationMessage } from '@/Components/Intranet/NotificationMessage';
import { ConfirmModal } from '@/Components/Intranet/ConfirmModal';

export default function IntranetLayout({ children, title = 'Sistema de Arquivos' }) {
    const { message, auth } = usePage().props;

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogoutConfirm = () => {
        router.post(route('Intranet.Usuarios.logout'));
    };

    const navigation = [
        { name: 'Arquivos', href: route('Intranet.index'), icon: FileText, current: route().current('Intranet.index') },
        ...(auth?.user?.admin == 1
            ? [{ name: 'Usuários', href: route('Intranet.Membros.index'), icon: Users, current: route().current('Intranet.Membros.*') }]
            : [])
    ];

    useEffect(() => {
        if (message) {
            const newNotification = { id: Date.now(), ...message };
            setNotifications((prevNotifications) => [...prevNotifications, newNotification]);

            const timer = setTimeout(() => {
                setNotifications((prevNotifications) =>
                    prevNotifications.filter((notification) => notification.id !== newNotification.id)
                );
            }, 5300);

            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content="Sistema de gerenciamento de arquivos da Pizzato" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta
                    name="csrf-token"
                    content={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')}
                />
            </Head>

            <div className="min-h-screen bg-gray-50">
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="container max-w-large">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 flex items-center">
                                    <img
                                        className="h-6 w-auto invert object-contain max-w-[30vw]"
                                        src="/admin/img/logo.png"
                                        alt="Logo da Empresa"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                        }}
                                    />
                                    <div
                                        className="hidden h-8 w-8 bg-neutral-600 rounded text-white items-center justify-center text-sm font-bold"
                                        style={{ display: 'none' }}
                                    >
                                        LE
                                    </div>
                                </div>

                                <nav className="hidden md:ml-12 md:flex md:space-x-6">
                                    {navigation.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                                    item.current
                                                        ? 'bg-neutral-100 text-neutral-700'
                                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                                }`}
                                            >
                                                <Icon className="w-4 h-4 mr-2" />
                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>

                            <div className="hidden md:flex md:items-center md:space-x-4">
                                <div className="text-sm text-gray-600">
                                    Olá,{' '}
                                    <span className="font-medium text-gray-900">
                                        {auth.user?.nome || 'Usuário'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setShowLogoutModal(true)}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sair
                                </button>
                            </div>

                            <div className="md:hidden">
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                >
                                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {mobileMenuOpen && (
                        <div className="md:hidden border-t border-gray-200 bg-white">
                            <div className="px-4 py-3 space-y-1">
                                {navigation.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors ${
                                                item.current
                                                    ? 'bg-neutral-100 text-neutral-700'
                                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                            }`}
                                        >
                                            <Icon className="w-5 h-5 mr-3" />
                                            {item.name}
                                        </Link>
                                    );
                                })}

                                <div className="border-t border-gray-200 pt-3 mt-3">
                                    <div className="px-3 py-2 text-sm text-gray-600">
                                        Logado como:{' '}
                                        <span className="font-medium text-gray-900">
                                            {auth.user?.nome || 'Usuário'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowLogoutModal(true);
                                            setMobileMenuOpen(false);
                                        }}
                                        className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                    >
                                        <LogOut className="w-5 h-5 mr-3" />
                                        Sair
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </header>

                <main className="flex-1">{children}</main>

                <footer className="bg-white border-t border-gray-200 mt-auto">
                    <div className="container max-w-large">
                        <div className="py-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
                            <div>© {new Date().getFullYear()} Pizzato. Todos os direitos reservados.</div>
                            <div className="mt-2 sm:mt-0">Desenvolvido por Octal Web</div>
                        </div>
                    </div>
                </footer>
            </div>

            {notifications.map((notification) => (
                <NotificationMessage
                    key={notification.id}
                    type={notification.type}
                    message={notification.msg}
                    show={true}
                    onClose={() =>
                        setNotifications((prevNotifications) =>
                            prevNotifications.filter((n) => n.id !== notification.id)
                        )
                    }
                />
            ))}

            {showLogoutModal && (
                <ConfirmModal
                    type="logOut"
                    data={{}}
                    onConfirm={handleLogoutConfirm}
                    onCancel={() => setShowLogoutModal(false)}
                />
            )}
        </>
    );
}
