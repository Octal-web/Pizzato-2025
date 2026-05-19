import React, { useState, useEffect, useCallback } from 'react';
import ImageViewer from './ImageViewer';
import TextViewer from './TextViewer';
import PdfViewer from './PdfViewer';
import DocxViewer from './DocxViewer';
import { getFileType, isViewableFile } from '@/utils/fileUtils';

const EnhancedFileViewer = ({ file, files, onClose }) => {
    const [currentFile, setCurrentFile] = useState(file);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [viewableFiles, setViewableFiles] = useState([]);

    useEffect(() => {
        // Filtra apenas arquivos visualizáveis
        const filteredFiles = files.filter(f => isViewableFile(f));
        setViewableFiles(filteredFiles);
        
        // Encontra o índice do arquivo atual
        const index = filteredFiles.findIndex(f => f.name === file.name);
        setCurrentIndex(index >= 0 ? index : 0);
        setCurrentFile(filteredFiles[index >= 0 ? index : 0]);
    }, [file, files]);

    const navigateToFile = useCallback((direction) => {
        const newIndex = direction === 'next' 
            ? (currentIndex + 1) % viewableFiles.length
            : (currentIndex - 1 + viewableFiles.length) % viewableFiles.length;
        
        setCurrentIndex(newIndex);
        setCurrentFile(viewableFiles[newIndex]);
    }, [currentIndex, viewableFiles]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            navigateToFile('prev');
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            navigateToFile('next');
        } else if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
        }
    }, [navigateToFile, onClose]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    if (!currentFile || viewableFiles.length === 0) return null;

    const fileType = getFileType(currentFile);
    const canNavigate = viewableFiles.length > 1;

    const renderViewer = () => {
        // Passa props adicionais para navegação
        const viewerProps = {
            file: currentFile,
            onClose,
            canNavigate,
            currentIndex: currentIndex + 1,
            totalFiles: viewableFiles.length,
            onNext: canNavigate ? () => navigateToFile('next') : undefined,
            onPrev: canNavigate ? () => navigateToFile('prev') : undefined
        };

        switch (fileType) {
            case 'image':
                return <ImageViewer {...viewerProps} />;
            case 'text':
                return <TextViewer {...viewerProps} />;
            case 'pdf':
                return <PdfViewer {...viewerProps} />;
            case 'docx':
                return <DocxViewer {...viewerProps} />;
            default:
                return <UnsupportedViewer {...viewerProps} />;
        }
    };

    return renderViewer();
};

// Componente para tipos não suportados com navegação
const UnsupportedViewer = ({ 
    file, 
    onClose, 
    canNavigate, 
    currentIndex, 
    totalFiles, 
    onNext, 
    onPrev 
}) => {
    const downloadUrl = route("Intranet.download", {
        name: file.name,
        path: file.path || "",
    });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[2100]">
            <div className="relative max-w-md w-full mx-4 bg-white rounded-lg overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg truncate">{file.name}</h3>
                        {canNavigate && (
                            <p className="text-sm text-gray-500">
                                {currentIndex} de {totalFiles}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {canNavigate && (
                            <>
                                <button
                                    onClick={onPrev}
                                    className="p-1 text-gray-500 hover:text-gray-700"
                                    title="Arquivo anterior (←)"
                                >
                                    ←
                                </button>
                                <button
                                    onClick={onNext}
                                    className="p-1 text-gray-500 hover:text-gray-700"
                                    title="Próximo arquivo (→)"
                                >
                                    →
                                </button>
                            </>
                        )}
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        >
                            ×
                        </button>
                    </div>
                </div>
                <div className="p-6 text-center">
                    <div className="mb-4">
                        <span className="text-4xl">📄</span>
                    </div>
                    <p className="text-gray-600 mb-4">
                        Este tipo de arquivo não pode ser visualizado diretamente no navegador.
                    </p>
                    <a
                        href={downloadUrl}
                        className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        Download do Arquivo
                    </a>
                </div>
            </div>
        </div>
    );
};

export default EnhancedFileViewer;