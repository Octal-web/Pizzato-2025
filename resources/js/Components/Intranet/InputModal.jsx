import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faFolderPlus, 
    faEdit,
    faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';

export const InputModal = ({ type, data, onConfirm, onCancel }) => {
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');

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

    useEffect(() => {
        if (type === 'rename' && data?.file?.name) {
            setInputValue(data.file.name);
        } else {
            setInputValue('');
        }
        setError('');
    }, [type, data]);

    const getModalConfig = () => {
        switch (type) {
            case 'createFolder':
                return {
                    icon: faFolderPlus,
                    title: 'Nova Pasta',
                    message: 'Digite o nome da nova pasta:',
                    placeholder: 'Nome da pasta',
                    confirmText: 'Criar Pasta',
                    cancelText: 'Cancelar',
                    confirmClass: 'bg-green-500 border-green-500 hover:bg-green-600',
                    iconClass: 'text-green-500 bg-green-100'
                };
            
            case 'rename':
                return {
                    icon: faEdit,
                    title: 'Renomear',
                    message: `Renomear "${data?.file?.name}":`,
                    placeholder: 'Novo nome',
                    confirmText: 'Renomear',
                    cancelText: 'Cancelar',
                    confirmClass: 'bg-blue-500 border-blue-500 hover:bg-blue-600',
                    iconClass: 'text-blue-500 bg-blue-100'
                };
            
            default:
                return {
                    icon: faExclamationTriangle,
                    title: 'Entrada',
                    message: 'Digite um valor:',
                    placeholder: 'Valor',
                    confirmText: 'Confirmar',
                    cancelText: 'Cancelar',
                    confirmClass: 'bg-gray-500 border-gray-500 hover:bg-gray-600',
                    iconClass: 'text-gray-500 bg-gray-100'
                };
        }
    };

    const validateInput = (value) => {
        if (!value || value.trim() === '') {
            return 'Este campo é obrigatório';
        }
        
        if (value.trim().length < 1) {
            return 'Nome deve ter pelo menos 1 caractere';
        }
        
        const invalidChars = /[<>:"/\\|?*]/;
        if (invalidChars.test(value)) {
            return 'Nome contém caracteres não permitidos: < > : " / \\ | ? *';
        }
        
        if (type === 'rename' && data?.file?.name && value.trim() === data.file.name.trim()) {
            return 'O nome deve ser diferente do atual';
        }
        
        return '';
    };

    const config = getModalConfig();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const trimmedValue = inputValue.trim();
        const validationError = validateInput(trimmedValue);
        
        if (validationError) {
            setError(validationError);
            return;
        }
        
        onConfirm(trimmedValue);
        onCancel();
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        if (error) {
            setError('');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[99999] sort-ignore">
            <div 
                className="absolute inset-0 bg-black bg-opacity-50" 
                onClick={onCancel}
            ></div>
            
            <div className="animate-fade-in-down [animation-duration:_0.1s] rounded-lg border border-stroke bg-white max-w-xl w-full mx-4 px-6 py-8 text-center shadow-lg relative">
                <div className="mb-6">
                    <FontAwesomeIcon 
                        icon={config.icon} 
                        className={`text-2xl ${config.iconClass} p-4 rounded-full`} 
                    />
                </div>
                
                <h2 className="text-xl font-bold mb-3 text-gray-800">
                    {config.title}
                </h2>
                
                <p className="text-gray-600 mb-6 font-medium">
                    {config.message}
                </p>
                
                <form onSubmit={handleSubmit} className="mb-6">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder={config.placeholder}
                        className={`w-full px-3 py-2.5 border rounded-md text-center font-medium focus:outline-none focus:ring-2 transition-colors ${
                            error 
                                ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        autoFocus
                        maxLength={255}
                    />
                    
                    {error && (
                        <p className="text-red-500 text-sm mt-2 text-left">
                            {error}
                        </p>
                    )}
                </form>
                
                <div className="flex gap-3">
                    <button
                        type="button"
                        className="flex-1 bg-gray-100 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-md hover:bg-gray-200 transition-colors font-medium"
                        onClick={onCancel}
                    >
                        {config.cancelText}
                    </button>
                    
                    <button
                        type="button"
                        className={`flex-1 ${config.confirmClass} text-white py-2.5 px-4 rounded-md transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
                        onClick={handleSubmit}
                        disabled={!inputValue.trim()}
                    >
                        {config.confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};