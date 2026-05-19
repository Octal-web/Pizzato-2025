import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTrash, 
    faEdit, 
    faArrowRightArrowLeft, 
    faSignOutAlt,
    faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';

export const ConfirmModal = ({ type, data, onConfirm, onCancel }) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onCancel();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onCancel]);

    const getModalConfig = () => {
        switch (type) {
            case 'delete':
                return {
                    icon: faTrash,
                    title: 'Excluir Arquivo?',
                    message: `Tem certeza que deseja excluir "${data.file.name}"?`,
                    description: 'Esta ação não pode ser desfeita.',
                    confirmText: 'Excluir',
                    cancelText: 'Cancelar',
                    confirmClass: 'bg-red-500 border-red-500 hover:bg-red-600',
                    iconClass: 'text-red-500 bg-red-100'
                };
        
            case 'bulkDelete':
                return {
                    icon: faTrash,
                    title: 'Confirmar Exclusão Múltipla',
                    message: `Tem certeza que deseja excluir ${data.count} arquivo(s)?`,
                    confirmText: 'Excluir Todos',
                    cancelText: 'Cancelar',
                    confirmClass: 'bg-red-500 border-red-500 hover:bg-red-600',
                    iconClass: 'text-red-500 bg-red-100'
                };
            
            
            case 'rename':
                return {
                    icon: faEdit,
                    title: 'Renomear Arquivo?',
                    message: `Renomear "${data.file.name}" para "${data.newName}"?`,
                    description: 'O arquivo será renomeado no sistema.',
                    confirmText: 'Sim, Renomear',
                    cancelText: 'Cancelar',
                    confirmClass: 'bg-blue-500 border-blue-500 hover:bg-blue-600',
                    iconClass: 'text-blue-500 bg-blue-100'
                };
            
            case 'move':
                return {
                    icon: faArrowRightArrowLeft,
                    title: 'Mover Arquivo?',
                    message: `Mover "${data.sourceFile.name}" para "${data.destinationName}"?`,
                    description: 'O arquivo será movido para o destino selecionado.',
                    confirmText: 'Sim, Mover',
                    cancelText: 'Cancelar',
                    confirmClass: 'bg-green-500 border-green-500 hover:bg-green-600',
                    iconClass: 'text-green-500 bg-green-100'
                };
            
            case 'logOut':
                return {
                    icon: faSignOutAlt,
                    title: 'Log Out?',
                    message: 'Tem certeza que deseja sair?',
                    description: 'Você será desconectado do sistema.',
                    confirmText: 'Sim, Sair',
                    cancelText: 'Cancelar',
                    confirmClass: 'bg-orange-500 border-orange-500 hover:bg-orange-600',
                    iconClass: 'text-orange-500 bg-orange-100'
                };
            
            default:
                return {
                    icon: faExclamationTriangle,
                    title: 'Confirmar Ação?',
                    message: 'Tem certeza que deseja prosseguir?',
                    description: 'Esta ação será executada.',
                    confirmText: 'Confirmar',
                    cancelText: 'Cancelar',
                    confirmClass: 'bg-gray-500 border-gray-500 hover:bg-gray-600',
                    iconClass: 'text-gray-500 bg-gray-100'
                };
        }
    };

    const config = getModalConfig();

    const handleConfirm = () => {
        onConfirm();
        onCancel();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[99999] sort-ignore">
            <div 
                className="absolute inset-0 bg-black bg-opacity-50" 
                onClick={onCancel}
            ></div>
            
            <div className="animate-fade-in-down [animation-duration:_0.1s] rounded-lg border border-stroke bg-white w-full max-w-xl mx-4 px-6 py-8 text-center shadow-lg relative">
                <div className="mb-6">
                    <FontAwesomeIcon 
                        icon={config.icon} 
                        className={`text-2xl ${config.iconClass} p-4 rounded-full`} 
                    />
                </div>
                
                <h2 className="text-xl font-bold mb-3 text-gray-800">
                    {config.title}
                </h2>
                
                <p className="text-gray-600 mb-2 font-medium">
                    {config.message}
                </p>
                
                <p className="text-gray-500 text-sm mb-8">
                    {config.description}
                </p>
                
                <div className="flex gap-3">
                    <button
                        className="flex-1 bg-gray-100 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-md hover:bg-gray-200 transition-colors font-medium"
                        onClick={onCancel}
                        autoFocus
                    >
                        {config.cancelText}
                    </button>
                    
                    <button
                        className={`flex-1 ${config.confirmClass} text-white py-2.5 px-4 rounded-md transition-colors font-medium`}
                        onClick={handleConfirm}
                    >
                        {config.confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};