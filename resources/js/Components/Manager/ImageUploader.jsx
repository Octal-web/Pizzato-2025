import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faCheckCircle, faSpinner, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

export const ImageUploader = ({ onUpload, crop, size, uploadStatus }) => {
    const [error, setError] = useState(null);
    const [queue, setQueue] = useState([]);

    const resizeAndCropImage = async (file) => {
        try {
            const options = {
                maxWidthOrHeight: 1500,
                useWebWorker: true,
                initialQuality: 1.0,
            };

            const compressedFile = await imageCompression(file, options);

            const img = new Image();
            img.src = URL.createObjectURL(compressedFile);

            return new Promise((resolve) => {
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    const cropWidth = size.largura ?? 1600;
                    const cropHeight = size.altura ?? 900;
                    canvas.width = cropWidth;
                    canvas.height = cropHeight;

                    const ratio = Math.min(
                        img.width / cropWidth,
                        img.height / cropHeight
                    );

                    const cropX = (img.width - cropWidth * ratio) / 2;
                    const cropY = (img.height - cropHeight * ratio) / 2;

                    ctx.drawImage(
                        img,
                        cropX,
                        cropY,
                        cropWidth * ratio,
                        cropHeight * ratio,
                        0,
                        0,
                        cropWidth,
                        cropHeight
                    );

                    canvas.toBlob((blob) => {
                        resolve({ blob, originalFile: file });
                    }, 'image/jpeg', 1.0);
                };
            });
        } catch (error) {
            console.error('Error resizing image:', error);
            setError('Erro ao redimensionar a imagem.');
            return null;
        }
    };

    const onDrop = useCallback(async (acceptedFiles) => {
        setError(null);

        const newQueueItems = acceptedFiles.map((file) => ({
            id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
            name: file.name,
            status: 'processando',
        }));
        setQueue((prev) => [...prev, ...newQueueItems]);

        const processedImages = await Promise.all(
            acceptedFiles.map(async (file) => {
                const { blob, originalFile } = await resizeAndCropImage(file);
                return crop ? { original: originalFile } : { resized: blob, original: originalFile };
            })
        );

        setQueue((prev) =>
            prev.map((item) =>
                newQueueItems.some((n) => n.id === item.id) ? { ...item, status: 'enviando' } : item
            )
        );

        onUpload(processedImages);
    }, [onUpload, crop]);

    useEffect(() => {
        if (!uploadStatus || uploadStatus === 'idle') return;

        setQueue((prev) =>
            prev.map((item) =>
                item.status === 'enviando' ? { ...item, status: uploadStatus } : item
            )
        );

        const timer = setTimeout(() => {
            setQueue((prev) => prev.filter((item) => item.status !== 'sucesso' && item.status !== 'erro'));
        }, 3000);

        return () => clearTimeout(timer);
    }, [uploadStatus]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png'],
            'image/jpg': ['.jpg'],
            'image/jpeg': ['.jpeg'],
        },
    });

    const statusIcon = {
        processando: <FontAwesomeIcon icon={faSpinner} spin className="text-gray-400" />,
        enviando: <FontAwesomeIcon icon={faSpinner} spin className="text-blue-500" />,
        sucesso: <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />,
        erro: <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />,
    };

    const statusLabel = {
        processando: 'Processando',
        enviando: 'Enviando',
        sucesso: 'Concluído',
        erro: 'Falhou',
    };

    return (
        <div>
            <div {...getRootProps()} className="flex flex-col justify-center items-center border-2 border-dashed border-gray-400 p-6 cursor-pointer">
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="text-gray-500 font-bold text-center mb-3">Solte as imagens aqui ...</p>
                ) : (
                    <p className="text-gray-500 font-bold text-center mb-3">Arraste e solte os arquivos aqui para enviar</p>
                )}
                <FontAwesomeIcon icon={faCloudUploadAlt} size="3x" className="text-gray-400 my-2" />
                {error && <p className="text-red-500">{error}</p>}
            </div>

            {queue.length > 0 && (
                <ul className="mt-3 space-y-1">
                    {queue.map((item) => (
                        <li
                            key={item.id}
                            className="flex items-center gap-2 text-sm px-2 py-1 rounded bg-gray-50 transition-opacity duration-500"
                        >
                            {statusIcon[item.status]}
                            <span className="truncate flex-1" title={item.name}>{item.name}</span>
                            <span className="text-xs text-gray-400">{statusLabel[item.status]}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};