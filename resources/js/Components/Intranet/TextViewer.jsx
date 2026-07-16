import React, { useState, useEffect } from 'react';

const TextViewer = ({ file, onClose }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch(route("Intranet.download", {
                    name: file.name,
                    path: file.path || "",
                }));
                
                if (!response.ok) {
                    throw new Error('Erro ao carregar arquivo');
                }
                
                const text = await response.text();
                setContent(text);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [file]);

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
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>
                <div className="flex-1 p-4 overflow-auto">
                    {loading && (
                        <div className="text-center text-gray-500 py-8">
                            Carregando...
                        </div>
                    )}
                    {error && (
                        <div className="text-center text-red-500 py-8">
                            Erro: {error}
                        </div>
                    )}
                    {!loading && !error && (
                        <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded">
                            {content}
                        </pre>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TextViewer;