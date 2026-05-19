import React, { useState, useEffect, useRef } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';

export const ImageUploadModal = ({ onImageSelect, onClose }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [uploadType, setUploadType] = useState('file');
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        img: '',
    });

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setData('img', file);

            const reader = new FileReader();
            reader.onload = (e) => {
                setImageUrl(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = (e) => {
        e.preventDefault();
        setUploading(true);

        if (uploadType === 'url') {
            if (imageUrl.trim()) {
                setUploading(false);
                onImageSelect(imageUrl.trim());
            } else {
                alert('Informe uma URL válida.');
            }
            return;
        }

        post(route('Manager.Finder.enviar'), {
            preserveScroll: true,
            onSuccess: (page) => {
                onImageSelect(page.props.message.url);
                setUploading(false);
            },
            onError: () => {
                alert('Erro ao fazer upload da imagem');
                setUploading(false);
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2100]">
            <div className="animate-fade-in-down [animation-duration:_0.1s] rounded-sm border border-stroke bg-white w-full max-w-lg p-6 shadow-md relative">
                <h3 className="text-lg font-medium mb-4">Inserir Imagem</h3>
                
                <div className="flex mb-4 border-b">
                    <button
                        type="button"
                        onClick={() => setUploadType('file')}
                        className={`px-4 py-2 font-medium ${
                            uploadType === 'file' 
                                ? 'border-b-2 border-blue-500 text-blue-600' 
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        Upload de Arquivo
                    </button>
                    <button
                        type="button"
                        onClick={() => setUploadType('url')}
                        className={`px-4 py-2 font-medium ${
                            uploadType === 'url' 
                                ? 'border-b-2 border-blue-500 text-blue-600' 
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        URL da Imagem
                    </button>
                </div>

                {uploadType === 'file' ? (
                    <div>
                        <div 
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4 cursor-pointer hover:border-gray-400"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {selectedFile ? (
                                <div>
                                    <img 
                                        src={imageUrl} 
                                        alt="Preview" 
                                        className="max-w-full max-h-40 mx-auto mb-2 rounded"
                                    />
                                    <p className="text-sm text-gray-600">{selectedFile.name}</p>
                                </div>
                            ) : (
                                <div>
                                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <p className="text-gray-600">Clique para selecionar uma imagem</p>
                                    <p className="text-sm text-gray-400">PNG, JPG, GIF até 10MB</p>
                                </div>
                            )}
                        </div>
                        
                        <input
                            name="img"
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </div>
                ) : (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            URL da Imagem
                        </label>
                        <input 
                            type="url"
                            value={imageUrl} 
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://exemplo.com/imagem.jpg" 
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />
                        {imageUrl && (
                            <div className="mt-2">
                                <img 
                                    src={imageUrl} 
                                    alt="Preview" 
                                    className="max-w-full max-h-40 rounded"
                                    onError={() => setImageUrl('')}
                                />
                            </div>
                        )}
                    </div>
                )}
                
                <div className="flex justify-end space-x-2">
                    <button 
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                        disabled={uploading}
                    >
                        Cancelar
                    </button>
                    <button 
                        type="button"
                        onClick={handleUpload}
                        disabled={uploading || (!selectedFile && !imageUrl)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {uploading ? 'Enviando...' : 'Inserir Imagem'}
                    </button>
                </div>
            </div>
        </div>
    );
};