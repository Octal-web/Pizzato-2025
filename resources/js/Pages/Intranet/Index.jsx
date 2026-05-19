import React, { useEffect, useState, useMemo } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import XHRUpload from '@uppy/xhr-upload';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import IntranetLayout from '@/Layouts/IntranetLayout';
import FileViewer from '@/Components/Intranet/FileViewer';
import EnhancedFileViewer from '@/Components/Intranet/EnhancedFileViewer';
import { ConfirmModal } from '@/Components/Intranet/ConfirmModal';
import { InputModal } from '@/Components/Intranet/InputModal';

import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

export default function Index({ files, currentPath }) {
    const [fileList, setFileList] = useState(files);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [currentPathState, setCurrentPathState] = useState(currentPath || "");
    const [isLoading, setIsLoading] = useState(false);
    const [viewingFile, setViewingFile] = useState(null);
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverFolder, setDragOverFolder] = useState(null);
    const [confirmModal, setConfirmModal] = useState(null);
    const [inputModal, setInputModal] = useState(null);

    useEffect(() => {
        setFileList(files);
    }, [files]);

    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    const { version } =  usePage();

    useEffect(() => {
        setCurrentPathState(currentPath);
    }, [currentPath]);

    const getParentPath = () => {
        if (!currentPathState) return null;
        const segments = currentPathState.split('/');
        segments.pop();
        return segments.length > 0 ? segments.join('/') : "";
    };

    const completeFileList = useMemo(() => {
        const parentPath = getParentPath();
        if (parentPath !== null) {
            const parentFolder = {
                name: "...",
                type: "parent-folder",
                size: null,
                modified: null,
                path: parentPath,
                isParentFolder: true
            };
            return [parentFolder, ...fileList];
        }
        return fileList;
    }, [fileList, currentPathState]);

    const uppy = useMemo(() => new Uppy({
        locale: {
            strings: {
                addMore: 'Adicionar mais',
                addMoreFiles: 'Adicionar mais arquivos',
                addingMoreFiles: 'Adicionando mais arquivos',
                allowAccessDescription: 'Para tirar fotos ou gravar vídeo com sua câmera, permita o acesso à câmera para este site.',
                allowAccessTitle: 'Permita acesso à sua câmera',
                authenticateWith: 'Conectar com %{pluginName}',
                authenticateWithTitle: 'Faça login com %{pluginName} para selecionar arquivos',
                back: 'Voltar',
                browse: 'procurar',
                browseFiles: 'procurar arquivos',
                cancel: 'Cancelar',
                cancelUpload: 'Cancelar upload',
                chooseFiles: 'Escolher arquivos',
                closeModal: 'Fechar modal',
                companionError: 'Falha na conexão com o Companion',
                complete: 'Completo',
                connectedToInternet: 'Conectado à Internet',
                copyLink: 'Copiar link',
                copyLinkToClipboardFallback: 'Copie a URL abaixo',
                copyLinkToClipboardSuccess: 'Link copiado para a área de transferência',
                creatingAssembly: 'Preparando upload...',
                creatingAssemblyFailed: 'Transloadit: Não foi possível criar Assembly',
                dashboardTitle: 'Upload de Arquivos',
                dashboardWindowTitle: 'Janela de Upload de Arquivos (Pressione escape para fechar)',
                dataUploadedOfTotal: '%{complete} de %{total}',
                done: 'Concluído',
                dropHereOr: 'Arraste arquivos aqui ou %{browse}',
                dropHint: 'Arraste seus arquivos aqui',
                dropPaste: 'Arraste arquivos aqui, cole ou %{browse}',
                dropPasteFiles: 'Arraste arquivos aqui, cole ou %{browseFiles}',
                dropPasteImport: 'Arraste arquivos aqui, cole, %{browse} ou importe de:',
                dropPasteImportFiles: 'Arraste arquivos aqui, cole, %{browseFiles} ou importe de:',
                edit: 'Editar',
                editFile: 'Editar arquivo',
                editing: 'Editando %{file}',
                emptyFolderAdded: 'Nenhum arquivo foi adicionado da pasta vazia',
                encoding: 'Codificando...',
                enterCorrectUrl: 'URL incorreta: Certifique-se de inserir um link direto para um arquivo',
                enterUrlToImport: 'Digite a URL para importar um arquivo',
                exceedsSize: 'Este arquivo excede o tamanho máximo permitido de %{size}',
                failedToFetch: 'Companion falhou ao buscar esta URL, certifique-se de que ela está correta',
                failedToUpload: 'Falha no upload de %{file}',
                fileSource: 'Origem do arquivo: %{name}',
                filesUploadedOfTotal: {
                    '0': '%{complete} de %{smart_count} arquivo enviado',
                    '1': '%{complete} de %{smart_count} arquivos enviados'
                },
                filter: 'Filtrar',
                finishEditingFile: 'Finalizar edição do arquivo',
                folderAdded: {
                    '0': 'Adicionado %{smart_count} arquivo da %{folder}',
                    '1': 'Adicionados %{smart_count} arquivos da %{folder}'
                },
                import: 'Importar',
                importFrom: 'Importar de %{name}',
                loading: 'Carregando...',
                logOut: 'Desconectar',
                myDevice: 'Meu Dispositivo',
                noFilesFound: 'Você não tem arquivos ou pastas aqui',
                noInternetConnection: 'Sem conexão com a Internet',
                pause: 'Pausar',
                pauseUpload: 'Pausar upload',
                paused: 'Pausado',
                poweredBy: 'Desenvolvido por %{uppy}',
                processingXFiles: {
                    '0': 'Processando %{smart_count} arquivo',
                    '1': 'Processando %{smart_count} arquivos'
                },
                removeFile: 'Remover arquivo',
                resetFilter: 'Resetar filtro',
                resume: 'Retomar',
                resumeUpload: 'Retomar upload',
                retry: 'Tentar novamente',
                retryUpload: 'Tentar upload novamente',
                saveChanges: 'Salvar alterações',
                selectX: {
                    '0': 'Selecionar %{smart_count}',
                    '1': 'Selecionar %{smart_count}'
                },
                smile: 'Sorria!',
                startRecording: 'Iniciar gravação de vídeo',
                stopRecording: 'Parar gravação de vídeo',
                takePicture: 'Tirar uma foto',
                timedOut: 'Upload parado por %{seconds} segundos, abortando.',
                upload: 'Upload',
                uploadComplete: 'Upload completo',
                uploadFailed: 'Upload falhou',
                uploadPaused: 'Upload pausado',
                uploadXFiles: {
                    '0': 'Fazer upload de %{smart_count} arquivo',
                    '1': 'Fazer upload de %{smart_count} arquivos'
                },
                uploadXNewFiles: {
                    '0': 'Fazer upload de +%{smart_count} arquivo',
                    '1': 'Fazer upload de +%{smart_count} arquivos'
                },
                uploading: 'Fazendo upload',
                uploadingXFiles: {
                    '0': 'Fazendo upload de %{smart_count} arquivo',
                    '1': 'Fazendo upload de %{smart_count} arquivos'
                },
                xFilesSelected: {
                    '0': '%{smart_count} arquivo selecionado',
                    '1': '%{smart_count} arquivos selecionados'
                },
                xMoreFilesAdded: {
                    '0': '%{smart_count} arquivo a mais adicionado',
                    '1': '%{smart_count} arquivos a mais adicionados'
                },
                xTimeLeft: '%{time} restante',
                youCanOnlyUploadX: {
                    '0': 'Você pode fazer upload de apenas %{smart_count} arquivo',
                    '1': 'Você pode fazer upload de apenas %{smart_count} arquivos'
                },
                youCanOnlyUploadFileTypes: 'Você pode fazer upload apenas destes tipos de arquivo: %{types}',
                youHaveToAtLeastSelectX: {
                    '0': 'Você deve selecionar pelo menos %{smart_count} arquivo',
                    '1': 'Você deve selecionar pelo menos %{smart_count} arquivos'
                }
            }
        },
        restrictions: {
            maxNumberOfFiles: 10,
        },
        meta: {
            path: currentPath || ""
        }
    }).use(XHRUpload, {
        endpoint: route("Intranet.upload"),
        formData: true,
        fieldName: 'file',
        headers: {
            'X-XSRF-TOKEN': match ? decodeURIComponent(match[1]) : null,
            'X-Inertia': 'true',
            'X-Inertia-Version': version,
            'X-Requested-With': 'XMLHttpRequest'
        }
    }), [currentPath]);

    uppy.on("complete", (result) => {
        if (result.successful.length > 0) {
            router.visit(window.location.href, {
                only: ['files', 'currentPath'],
                preserveScroll: true,
                preserveState: true,
            });
        }
    });

    const closeModal = () => {
        setConfirmModal(null);
        setInputModal(null);
    };

    const handleEnterFolder = (folder) => {
        if (isLoading) return;

        let newPath;
        if (folder.type === 'parent-folder') {
            newPath = getParentPath();
        } else {
            newPath = currentPathState ? `${currentPathState}/${folder.name}` : folder.name;
        }
        
        setIsLoading(true);

        const url = new URL(window.location);
        if (newPath) {
            url.searchParams.set('path', newPath);
        } else {
            url.searchParams.delete('path');
        }
        window.history.pushState({}, '', url);

        const routeParams = newPath ? { path: newPath } : {};
        router.get(
            route('Intranet.index'),
            routeParams,
            {
                preserveState: true,
                only: ['files', 'currentPath'],
                onFinish: () => setIsLoading(false),
            }
        );

        setCurrentPathState(newPath || "");
    };

    const handleCreateFolder = () => {
        setInputModal({
            type: 'createFolder',
            data: {},
            action: (folderName) => {
                router.post(route("Intranet.createFolder"), {
                    name: folderName,
                    path: currentPath || "",
                }, {
                    only: ['files'],
                });
            }
        });
    };

    const handleDelete = (file) => {
        if (file.type === 'parent-folder') return;
        
        setConfirmModal({
            type: 'delete',
            data: { file },
            action: () => {
                router.delete(route("Intranet.delete"), {
                    data: {
                        name: file.name,
                        path: file.path || "",
                    },
                });
            }
        });
    };

    const handleRename = (file) => {
        if (file.type === 'parent-folder') return;
        
        setInputModal({
            type: 'rename',
            data: { file },
            action: (newName) => {
                router.patch(route("Intranet.rename"), {
                    oldName: file.name,
                    newName: newName,
                    path: file.path || "",
                });
            }
        });
    };

    const handleDownload = (file) => {
        if (file.type === 'parent-folder' || file.type === 'folder') return;
        
        window.location.href = route("Intranet.download", {
            name: file.name,
            path: file.path || "",
        });
    };

    const handleViewFile = (file) => {
        if (file.type === 'parent-folder' || file.type === 'folder') return;
        setViewingFile(file);
    };

    const handleCloseViewer = () => {
        setViewingFile(null);
    };

    const handleDragStart = (e, file, index) => {
        if (file.type === 'parent-folder') {
            e.preventDefault();
            return;
        }
        
        setDraggedItem({ file, index });
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', file.name);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
        setDragOverFolder(null);
    };

    const handleDragOver = (e, targetFolder, targetIndex) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        if (targetFolder && (targetFolder.type === 'folder' || targetFolder.type === 'parent-folder')) {
            setDragOverFolder(targetIndex);
        }
    };

    const handleDragLeave = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;
        
        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
            setDragOverFolder(null);
        }
    };

    const handleDrop = (e, targetFolder, targetIndex) => {
        e.preventDefault();
        setDragOverFolder(null);

        if (!draggedItem || !targetFolder || 
            (targetFolder.type !== 'folder' && targetFolder.type !== 'parent-folder')) {
            return;
        }

        if (draggedItem.index === targetIndex) {
            return;
        }

        const sourceFile = draggedItem.file;
        let targetPath;
        let destinationName;
        
        if (targetFolder.type === 'parent-folder') {
            const parentPath = getParentPath();
            targetPath = parentPath === "" ? "/" : parentPath;
            destinationName = parentPath === "" ? "pasta raiz" : parentPath.split('/').pop();
        } else {
            targetPath = currentPathState ? `${currentPathState}/${targetFolder.name}` : targetFolder.name;
            destinationName = targetFolder.name;
        }

        setConfirmModal({
            type: 'move',
            data: { sourceFile, destinationName },
            action: () => {
                const moveData = {
                    sourceName: sourceFile.name,
                    sourcePath: currentPathState || "/",
                    targetPath: targetPath,
                };

                router.patch(route("Intranet.move"), moveData, {
                    only: ['files'],
                    onSuccess: () => {
                        console.log('Arquivo movido com sucesso!');
                    },
                    onError: (errors) => {
                        console.error('Erro ao mover arquivo:', errors);
                    }
                });
            }
        });

        setDraggedItem(null);
    };

    const isViewableFile = (file) => {
        if (file.type === "folder" || file.type === "parent-folder") return false;
        
        const ext = file.name.toLowerCase().split('.').pop();
        const viewableExtensions = [
            'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg',
            'txt', 'md', 'csv', 'json', 'xml', 'log', 'ini', 'cfg',
            'pdf',
            'docx', 'doc'
        ];
        
        return viewableExtensions.includes(ext);
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleDateString('pt-BR');
    };

    const handleSelectFile = (index) => {
        setSelectedFiles(prev => 
            prev.includes(index) 
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const handleSelectAll = () => {
        const selectableFiles = completeFileList
            .map((file, index) => file.type !== 'parent-folder' ? index : null)
            .filter(index => index !== null);
        
        if (selectedFiles.length === selectableFiles.length) {
            setSelectedFiles([]);
        } else {
            setSelectedFiles(selectableFiles);
        }
    };

    const handleBulkDownload = () => {
        const selectedFileObjects = selectedFiles
            .map(index => completeFileList[index])
            .filter(file => file.type !== 'folder' && file.type !== 'parent-folder');
        
        if (selectedFileObjects.length === 0) {
            alert('Nenhum arquivo válido selecionado para download.');
            return;
        }
        
        if (selectedFileObjects.length === 1) {
            const file = selectedFileObjects[0];
            window.location.href = route("Intranet.download", {
                name: file.name,
                path: file.path || "",
            });
        } else {
            const fileData = selectedFileObjects.map(file => ({
                name: file.name,
                path: file.path || ""
            }));
            
            window.location.href = route("Intranet.downloadMultiple", {
                files: JSON.stringify(fileData)
            });
        }
    };

    const handleBulkDelete = () => {
        const selectedFileObjects = selectedFiles.map(index => completeFileList[index]);
        
        if (selectedFileObjects.length === 0) {
            alert('Nenhum arquivo selecionado para excluir.');
            return;
        }
        
        setConfirmModal({
            type: 'bulkDelete',
            data: { 
                files: selectedFileObjects,
                count: selectedFileObjects.length
            },
            action: () => {
                const deleteData = {
                    files: selectedFileObjects.map(file => ({
                        name: file.name,
                        path: file.path || ""
                    }))
                };

                console.log(deleteData)

                router.delete(route("Intranet.deleteMultiple"), {
                    data: deleteData,
                    onSuccess: () => {
                        setSelectedFiles([]);
                    },
                    onError: (errors) => {
                        console.error('Erro ao excluir arquivos:', errors);
                    }
                });
            }
        });
    };

    const handleDeselectAll = () => {
        setSelectedFiles([]);
    };

    return (
        <IntranetLayout>
            <section>
                <div className="container max-w-large">
                    <div className="file-manager min-h-[calc(100vh_-_119px)] py-10">
                        <div className="mb-5 flex items-center justify-between">
                            <button 
                                onClick={handleCreateFolder}
                                className="px-4 py-2 bg-neutral-800 text-white border-0 rounded cursor-pointer hover:bg-neutral-700 transition-colors"
                            >
                                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                Nova Pasta
                            </button>
                            
                            <span className="text-sm text-gray-600">
                                Pasta atual: <Link href={route('Intranet.index')}>Início</Link>
                                {currentPath &&
                                    currentPath.split("/").map((segment, index, arr) => {
                                    const pathUpToHere = arr.slice(0, index + 1).join("/");

                                    return (
                                        <span key={index}>
                                            {" / "}
                                            <Link
                                                href={route("Intranet.index", { path: pathUpToHere })}
                                            >
                                                {segment}
                                            </Link>
                                        </span>
                                    );
                                })}
                            </span>
                        </div>

                        <div className="mb-8">
                            <Dashboard
                                uppy={uppy}
                                width="100%"
                                height={350}
                                theme="light"
                                proudlyDisplayPoweredByUppy={false}
                                showProgressDetails={true}
                                className="[&_.uppy-Dashboard-AddFiles-title]:!max-w-xl"
                            />
                        </div>

                        <div className="overflow-auto">
                            <div className="border border-gray-300 rounded min-w-[650px]">
                                <div className="grid grid-cols-[40px_2fr_15%_15%_1fr] bg-gray-50 p-2.5 font-bold border-b border-gray-300">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedFiles.length > 0 && selectedFiles.length === completeFileList.filter(file => file.type !== 'parent-folder').length}
                                            onChange={handleSelectAll}
                                            className="mr-2 checked:bg-black checked:focus:bg-black checked:focus:ring-0 focus:ring-0 checked:hover:bg-black"
                                        />
                                    </div>
                                    <div>Nome</div>
                                    <div>Tamanho</div>
                                    <div>Modificado</div>
                                    <div>Ações</div>
                                </div>

                                {completeFileList && completeFileList.length > 0 ? (
                                    completeFileList.map((file, index) => (
                                        <div 
                                            key={file.type === 'parent-folder' ? 'parent' : index}
                                            draggable={file.type !== 'parent-folder'}
                                            onDragStart={(e) => handleDragStart(e, file, index)}
                                            onDragEnd={handleDragEnd}
                                            onDragOver={(e) => handleDragOver(e, file, index)}
                                            onDragLeave={handleDragLeave}
                                            onDrop={(e) => handleDrop(e, file, index)}
                                            className={`grid grid-cols-[40px_2fr_15%_15%_1fr] p-2.5 border-b border-gray-200 items-center cursor-pointer hover:bg-gray-50 transition-colors ${
                                                selectedFiles.includes(index) ? 'bg-neutral-50' : 'bg-white'
                                            } ${
                                                dragOverFolder === index ? 'bg-blue-100 border-2 border-blue-400 border-dashed' : ''
                                            } ${
                                                draggedItem?.index === index ? 'opacity-50' : ''
                                            } ${
                                                file.type === 'parent-folder' ? 'bg-gray-50' : ''
                                            }`}
                                            onClick={() => {
                                                if (file.type === "folder" || file.type === "parent-folder") {
                                                    handleEnterFolder(file);
                                                }
                                            }}
                                        >
                                            <div className="flex items-center">
                                                {file.type !== 'parent-folder' && (
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedFiles.includes(index)}
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            handleSelectFile(index);
                                                        }}
                                                        className="mr-2 checked:bg-black checked:focus:bg-black checked:focus:ring-0 focus:ring-0 checked:hover:bg-black"
                                                    />
                                                )}
                                                {file.type === 'parent-folder' && <div className="w-5 mr-2"></div>}
                                            </div>
                                            
                                            <button
                                                className="flex items-center"
                                                onClick={(e) => {
                                                    if (file.type !== "folder" && file.type !== "parent-folder") {
                                                        e.stopPropagation();
                                                        handleViewFile(file);
                                                    }
                                                }}
                                            >
                                                <span className="mr-2 select-none">
                                                    {file.type === "parent-folder" ? "⬆️" : 
                                                    file.type === "folder" ? "📁" : "📄"}
                                                </span>
                                                <span className={`text-left select-none ${
                                                    file.type === 'parent-folder' ? 'italic text-gray-600' : ''
                                                }`}>
                                                    {file.name}
                                                </span>
                                            </button>
                                            
                                            <div className="select-none">
                                                {file.type === "folder" || file.type === "parent-folder" ? 
                                                "-" : formatFileSize(file.size)}
                                            </div>
                                            
                                            <div className="select-none">
                                                {file.type === "parent-folder" ? 
                                                "-" : formatDate(file.modified)}
                                            </div>
                                            
                                            <div className="flex gap-1">
                                                {file.type !== 'parent-folder' && (
                                                    <>
                                                        {isViewableFile(file) && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleViewFile(file);
                                                                }}
                                                                className="px-2 py-1 text-xs border border-neutral-500 rounded bg-neutral-500 text-white cursor-pointer hover:bg-blue-600 transition-colors"
                                                            >
                                                                Visualizar
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRename(file);
                                                            }}
                                                            className="px-2 py-1 text-xs border border-gray-300 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                                                        >
                                                            Renomear
                                                        </button>
                                                        {file.type !== "folder" && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDownload(file);
                                                                }}
                                                                className="px-2 py-1 text-xs border border-gray-300 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                                                            >
                                                                Download
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(file);
                                                            }}
                                                            className="px-2 py-1 text-xs border border-red-500 rounded bg-red-500 text-white cursor-pointer hover:bg-red-600 transition-colors"
                                                        >
                                                            Excluir
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        <p>Nenhum arquivo encontrado nesta pasta</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {draggedItem && (
                            <div className="fixed top-4 left-4 bg-neutral-500 text-white px-3 py-1 rounded shadow-lg pointer-events-none z-50">
                                Movendo: {draggedItem.file.name}
                            </div>
                        )}

                        {selectedFiles.length > 0 && (
                            <div className="mt-4 p-3 bg-neutral-50 border border-neutral-200 rounded flex items-center justify-between">
                                <span className="text-sm text-neutral-800">
                                    {selectedFiles.length} arquivo{selectedFiles.length > 1 ? 's' : ''} selecionado{selectedFiles.length > 1 ? 's' : ''}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleBulkDownload}
                                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                    >
                                        Download Selecionados
                                    </button>
                                    <button
                                        onClick={handleBulkDelete}
                                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                    >
                                        Excluir Selecionados
                                    </button>
                                    <button
                                        onClick={handleDeselectAll}
                                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                    >
                                        Desmarcar Todos
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {viewingFile && (
                <FileViewer 
                    file={viewingFile} 
                    onClose={handleCloseViewer} 
                />
            )}

            {inputModal && (
                <InputModal
                    type={inputModal.type}
                    data={inputModal.data}
                    onConfirm={inputModal.action}
                    onCancel={closeModal}
                />
            )}

            {confirmModal && (
                <ConfirmModal
                    type={confirmModal.type}
                    data={confirmModal.data}
                    onConfirm={confirmModal.action}
                    onCancel={closeModal}
                />
            )}
        </IntranetLayout>
    );
}