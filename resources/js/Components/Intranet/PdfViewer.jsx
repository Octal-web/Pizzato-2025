import React, { useEffect } from 'react';

const PdfViewer = ({ file, onClose }) => {
    const pdfUrl = route("Intranet.download", {
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

            <div className="relative w-[95vw] h-[95vh] bg-white rounded-lg overflow-hidden animate-fade-in-down flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="font-semibold text-lg truncate">{file.name}</h3>
                    <div className="flex gap-2">
                        <a
                            href={`files/${file.path + '/' + file.name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 self-center bg-neutral-700 text-white text-sm rounded hover:bg-neutral-800 transition-colors"
                        >
                            Abrir em nova aba
                        </a>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        >
                            ×
                        </button>
                    </div>
                </div>
                <div className="flex-1">
                    <iframe
                        src={`files/${file.path + '/' + file.name}#toolbar=1&navpanes=1&scrollbar=1`}
                        className="w-full h-full border-0"
                        title={file.name}
                    />
                </div>
            </div>
        </div>
    );
};

export default PdfViewer;