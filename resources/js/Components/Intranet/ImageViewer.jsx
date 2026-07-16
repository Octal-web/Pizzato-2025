import React, { useEffect } from 'react';

const ImageViewer = ({ 
    file, 
    onClose, 
    canNavigate, 
    currentIndex, 
    totalFiles, 
    onNext, 
    onPrev 
}) => {
    const imageUrl = route("Intranet.download", {
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
            <div className="relative max-w-[95vw] max-h-[95vh] bg-white rounded-lg overflow-hidden animate-fade-in-down">
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
                                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                                    title="Imagem anterior (←)"
                                >
                                    ← Anterior
                                </button>
                                <button
                                    onClick={onNext}
                                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                                    title="Próxima imagem (→)"
                                >
                                    Próxima →
                                </button>
                            </>
                        )}
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-2xl font-bold ml-2"
                        >
                            ×
                        </button>
                    </div>
                </div>
                <div className="p-4 flex justify-center">
                    <img
                        src={imageUrl}
                        alt={file.name}
                        className="max-w-full max-h-[80vh] object-contain cursor-pointer"
                        onClick={() => {
                            if (canNavigate && onNext) onNext();
                        }}
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                        }}
                    />
                    <div className="hidden text-center text-gray-500 py-8">
                        Não foi possível carregar a imagem
                    </div>
                </div>
                {canNavigate && (
                    <div className="absolute inset-y-0 left-0 flex items-center">
                        <button
                            onClick={onPrev}
                            className="ml-2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-opacity"
                            title="Imagem anterior"
                        >
                            ←
                        </button>
                    </div>
                )}
                {canNavigate && (
                    <div className="absolute inset-y-0 right-0 flex items-center">
                        <button
                            onClick={onNext}
                            className="mr-2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-opacity"
                            title="Próxima imagem"
                        >
                            →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageViewer;