import React, { useState, useEffect } from 'react';

import mammoth from 'mammoth';

const DocxViewer = ({ file, onClose }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                if (typeof mammoth === 'undefined') {
                    throw new Error('Biblioteca mammoth não encontrada. Para visualizar arquivos DOCX, instale: npm install mammoth');
                }

                const response = await fetch(route("Intranet.download", {
                    name: file.name,
                    path: file.path || "",
                }));
                
                if (!response.ok) {
                    throw new Error('Erro ao carregar arquivo');
                }
                
                const arrayBuffer = await response.arrayBuffer();
                const result = await mammoth.convertToHtml({ arrayBuffer });
                setContent(result.value);
                
                if (result.messages.length > 0) {
                    console.warn('Avisos do mammoth:', result.messages);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [file]);

    const downloadUrl = route("Intranet.download", {
        name: file.name,
        path: file.path || "",
    });

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[2100]">
            <button onClick={onClose} className="absolute inset-0 bg-black bg-opacity-75 cursor-default" />

            <div className="relative w-[90vw] h-[90vh] bg-white rounded-lg overflow-hidden animate-fade-in-down flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="font-semibold text-lg truncate">{file.name}</h3>
                    <div className="flex gap-2">
                        <a
                            href={downloadUrl}
                            className="px-3 py-1 self-center bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                        >
                            Download
                        </a>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        >
                            ×
                        </button>
                    </div>
                </div>
                <div className="flex-1 p-4 overflow-auto">
                    {loading && (
                        <div className="text-center text-gray-500 py-8">
                            Carregando documento...
                        </div>
                    )}
                    {error && (
                        <div className="text-center text-red-500 py-8">
                            <p>Erro: {error}</p>
                            <p className="mt-2 text-sm">
                                Você pode fazer o <a href={downloadUrl} className="text-blue-500 underline">download do arquivo</a> para abrir em um programa adequado.
                            </p>
                        </div>
                    )}
                    {!loading && !error && (
                        <div 
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocxViewer;