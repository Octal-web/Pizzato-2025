import React from 'react';
import ImageViewer from './ImageViewer';
import TextViewer from './TextViewer';
import PdfViewer from './PdfViewer';
import DocxViewer from './DocxViewer';
import { getFileType } from '@/utils/fileUtils';

const FileViewer = ({ file, onClose }) => {
    if (!file) return null;

    const fileType = getFileType(file);

    const renderViewer = () => {
        switch (fileType) {
            case 'image':
                return <ImageViewer file={file} onClose={onClose} />;
            case 'text':
                return <TextViewer file={file} onClose={onClose} />;
            case 'pdf':
                return <PdfViewer file={file} onClose={onClose} />;
            case 'docx':
                return <DocxViewer file={file} onClose={onClose} />;
            default:
                return <UnsupportedViewer file={file} onClose={onClose} />;
        }
    };

    return renderViewer();
};

const UnsupportedViewer = ({ file, onClose }) => {
    const downloadUrl = route("Intranet.download", {
        name: file.name,
        path: file.path || "",
    });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[2100]">
            <div className="relative max-w-md w-full mx-4 bg-white rounded-lg overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="font-semibold text-lg truncate">{file.name}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    >
                        ×
                    </button>
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

export default FileViewer;