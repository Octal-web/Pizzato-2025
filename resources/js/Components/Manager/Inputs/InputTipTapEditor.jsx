import ImageResizeWithCaption from '@pentestpad/tiptap-extension-figure';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { Underline } from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ImageUploadModal } from './ImageUploadModal';

const ImageEditModal = ({ node, onConfirm, onClose }) => {
    const [src, setSrc]       = useState(node?.attrs?.src || '');
    const [alt, setAlt]       = useState(node?.attrs?.alt || '');
    const [width, setWidth]   = useState(node?.attrs?.width || '');
    const [showFinder, setShowFinder] = useState(false);

    const handleConfirm = () => {
        onConfirm({ src, alt, width: width || undefined });
    };

    const handleFinderSelect = (url) => {
        setSrc(url);
        setShowFinder(false);
    };

    if (showFinder) {
        return (
            <ImageUploadModal
                onImageSelect={handleFinderSelect}
                onClose={() => setShowFinder(false)}
            />
        );
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (src) handleConfirm();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white shadow-xl w-full max-w-md p-6 animate-fade-in-down [animation-duration:_0.1s]">
                <h3 className="text-base font-semibold text-gray-800 mb-5">Propriedades da imagem</h3>

                {src && (
                    <div className="mb-4 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden h-36">
                        <img
                            src={src}
                            alt={alt || 'preview'}
                            className="max-h-full max-w-full object-contain"
                        />
                    </div>
                )}

                <div className="mb-3">
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">URL da imagem</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={src}
                            onChange={(e) => setSrc(e.target.value)}
                            placeholder="https://exemplo.com/imagem.jpg"
                            className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyDown={handleKeyDown}
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={() => setShowFinder(true)}
                            className="px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors whitespace-nowrap"
                            title="Abrir Finder"
                        >
                            Localizar…
                        </button>
                    </div>
                </div>

                {/* Alt */}
                <div className="mb-3">
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Texto alternativo (alt)</label>
                    <input
                        type="text"
                        value={alt}
                        onChange={(e) => setAlt(e.target.value)}
                        placeholder="Descrição da imagem"
                        onKeyDown={handleKeyDown}
                        className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-5">
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Largura (px ou %)</label>
                    <input
                        type="text"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        placeholder="Ex: 400 ou 100%"
                        onKeyDown={handleKeyDown}
                        className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!src}
                        className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-lg transition-colors font-medium"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

const TableToolbar = ({ editor }) => {
    if (!editor || !editor.isActive('table')) return null;

    const btn = (title, icon, onClick, danger = false) => (
        <button
            type="button"
            title={title}
            onClick={onClick}
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors
                ${danger
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
        >
            {icon}
            <span className="hidden sm:inline">{title}</span>
        </button>
    );

    const Divider = () => <div className="w-px h-5 bg-gray-200 mx-1" />;

    return (
        <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-amber-50 border-b border-amber-200 text-xs">
            <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide mr-2 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 2h-4v3h4zm0 4h-4v3h4zm0 4h-4v3h3a1 1 0 0 0 1-1zm-5 3v-3H6v3zm-5 0v-3H1v2a1 1 0 0 0 1 1zm-4-4h4V8H1zm0-4h4V4H1zm5-3v3h4V4zm4 4H6v3h4z"/>
                </svg>
                Tabela
            </span>

            {btn('Inserir linha acima',
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4 10.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5m0 3a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5M2.5 8a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                    <path d="M8 1a.5.5 0 0 1 .5.5V3h1.5a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V4H6a.5.5 0 0 1 0-1h1.5V1.5A.5.5 0 0 1 8 1"/>
                </svg>,
                () => editor.chain().focus().addRowBefore().run()
            )}
            {btn('Inserir linha abaixo',
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M2.5 8a.5.5 0 0 0 .5-.5h10a.5.5 0 0 0 0-1H3a.5.5 0 0 0-.5.5"/>
                    <path d="M8 15a.5.5 0 0 0 .5-.5V13h1.5a.5.5 0 0 0 0-1H8.5v-1.5a.5.5 0 0 0-1 0V12H6a.5.5 0 0 0 0 1h1.5v1.5A.5.5 0 0 0 8 15"/>
                </svg>,
                () => editor.chain().focus().addRowAfter().run()
            )}
            {btn('Remover linha',
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z"/>
                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1"/>
                </svg>,
                () => editor.chain().focus().deleteRow().run(),
                true
            )}

            <Divider />

            {btn('Inserir coluna antes',
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M9.5 4.5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0zM12.5 4.5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0zM7 8a.5.5 0 0 1-.5.5H5v1.5a.5.5 0 0 1-1 0V8.5H2.5a.5.5 0 0 1 0-1H4V6a.5.5 0 0 1 1 0v1.5h1.5A.5.5 0 0 1 7 8z"/>
                </svg>,
                () => editor.chain().focus().addColumnBefore().run()
            )}
            {btn('Inserir coluna depois',
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M6.5 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zM3.5 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zM9 8a.5.5 0 0 0 .5.5H11v1.5a.5.5 0 0 0 1 0V8.5h1.5a.5.5 0 0 0 0-1H12V6a.5.5 0 0 0-1 0v1.5H9.5A.5.5 0 0 0 9 8z"/>
                </svg>,
                () => editor.chain().focus().addColumnAfter().run()
            )}
            {btn('Remover coluna',
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6A.5.5 0 0 1 8 5.5"/>
                    <path fillRule="evenodd" d="M4 7.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 1 0V8a.5.5 0 0 0-.5-.5m8 0a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 1 0V8a.5.5 0 0 0-.5-.5"/>
                </svg>,
                () => editor.chain().focus().deleteColumn().run(),
                true
            )}

            <Divider />

            {btn('Excluir tabela',
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                </svg>,
                () => editor.chain().focus().deleteTable().run(),
                true
            )}
        </div>
    );
};

export const InputTipTapEditor = ({ title, name, toolbar = [], value, idioma, onChange, max = null }) => {
    const [showGrid, setShowGrid]           = useState(false);
    const gridRef                           = useRef(null);
    const [hoveredCell, setHoveredCell]     = useState(null);

    const [showLinkModal, setShowLinkModal] = useState(false);
    const [linkUrl, setLinkUrl]             = useState('');
    const [openInNewTab, setOpenInNewTab]   = useState(true);

    const [showImageModal, setShowImageModal]       = useState(false);
    const [showImageEditModal, setShowImageEditModal] = useState(false);
    const [editingImageNode, setEditingImageNode]   = useState(null);
    const [editingImagePos, setEditingImagePos]     = useState(null);

    const [contentLength, setContentLength] = useState(0);

    const [inTable, setInTable] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            ImageResizeWithCaption.configure({
                resize: { minWidth: 100, maxWidth: 1000, step: 10 },
            }),
            Table.configure({ withHeaderRow: false }),
            TableRow,
            TableCell,
            TableHeader,
            Link.configure({ openOnClick: false, linkOnPaste: true }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            const content   = editor.getHTML();
            const textLength = editor.getText().length;
            setContentLength(textLength);
            if (max !== null && textLength > max) {
                editor.commands.undo();
                return;
            }
            onChange(name, content);
        },
        onSelectionUpdate: ({ editor }) => {
            setInTable(editor.isActive('table'));
        },
    }, [name, max]);

    const editorWrapperRef = useRef(null);

    useEffect(() => {
        const el = editorWrapperRef.current;
        if (!el || !editor) return;

        const handleDblClick = (e) => {
            const imgEl = e.target.closest('img');
            if (!imgEl) return;

            const view = editor.view;
            const pos  = view.posAtDOM(imgEl, 0);
            if (pos == null) return;

            const $pos    = view.state.doc.resolve(pos);
            const node    = view.state.doc.nodeAt(pos) ?? $pos.parent;

            setEditingImageNode(node);
            setEditingImagePos(pos);
            setShowImageEditModal(true);
        };

        el.addEventListener('dblclick', handleDblClick);
        return () => el.removeEventListener('dblclick', handleDblClick);
    }, [editor]);

    const handleImageEditConfirm = useCallback(({ src, alt, width }) => {
        if (!editor || editingImagePos == null) return;

        editor.chain().focus().run();

        const { state, dispatch } = editor.view;
        const node = state.doc.nodeAt(editingImagePos);

        if (node && (node.type.name === 'image' || node.type.name === 'figure')) {
            const tr = state.tr.setNodeMarkup(editingImagePos, undefined, {
                ...node.attrs,
                src,
                alt,
                ...(width ? { width } : {}),
            });
            dispatch(tr);
        } else {
            editor.chain().focus().setImage({ src, alt, width }).run();
        }

        setShowImageEditModal(false);
        setEditingImageNode(null);
        setEditingImagePos(null);
    }, [editor, editingImagePos]);

    const handleImageSelect = (imageUrl) => {
        editor.chain().focus().setImage({ src: imageUrl }).run();
        setShowImageModal(false);
    };

    const handleInsertTable = (rows, cols) => {
        editor.chain().focus().insertTable({ rows, cols, withHeaderRow: false }).run();

        setTimeout(() => {
            const { state, dispatch } = editor.view;
            const { tr, doc } = state;
            let changed = false;

            doc.descendants((node, pos) => {
                if (node.type.name === 'tableHeader') {
                    const tdType = state.schema.nodes.tableCell;
                    tr.setNodeMarkup(pos, tdType, node.attrs, node.marks);
                    changed = true;
                }
            });

            if (changed) dispatch(tr);
        }, 0);

        setShowGrid(false);
    };
    
    
    const openLinkModal = () => {
        const linkMark = editor.getAttributes('link');
        if (linkMark.href) {
            setLinkUrl(linkMark.href);
            setOpenInNewTab(linkMark.target === '_blank');
        } else {
            setLinkUrl('');
            setOpenInNewTab(true);
        }
        setShowLinkModal(true);
    };

    const insertLink = () => {
        if (linkUrl) {
            const attrs = {
                href: linkUrl,
                target: openInNewTab ? '_blank' : null,
                rel:    openInNewTab ? 'noopener noreferrer' : null,
            };
            if (editor.state.selection.empty) {
                editor.chain().focus().insertContent({ type: 'text', text: linkUrl }).run();
                editor.chain().focus().setTextSelection({
                    from: editor.state.selection.from - linkUrl.length,
                    to:   editor.state.selection.from,
                }).run();
            }
            editor.chain().focus().setLink(attrs).run();
        } else {
            editor.chain().focus().unsetLink().run();
        }
        setShowLinkModal(false);
    };

    const removeLink = () => {
        editor.chain().focus().unsetLink().run();
        setShowLinkModal(false);
    };

    useEffect(() => {
        const handler = (e) => {
            if (gridRef.current && !gridRef.current.contains(e.target)) setShowGrid(false);
        };
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, []);

    if (!editor) return null;

    return (
        <div className="mb-6">
            <div className="flex items-center mb-2">
                <label className="block font-bold text-gray-500">{title}</label>
            </div>

            <div className="border">
                {/* ── Main toolbar ── */}
                <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b">

                    {toolbar.includes('Heading') && (
                        <div className="flex border-r pr-2 mr-1">
                            <select
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (value === "paragraph") {
                                        editor
                                            .chain()
                                            .focus()
                                            .setParagraph()
                                            .run();
                                    } else {
                                        const level = parseInt(
                                            e.target.value,
                                            10,
                                        );
                                        editor
                                            .chain()
                                            .focus()
                                            .toggleHeading({ level })
                                            .run();
                                    }
                                }}
                                className="py-1 px-2 rounded border bg-white h-8 w-40 leading-none"
                                title="Selecione o título"
                            >
                                <option value="paragraph">Parágrafo</option>
                                <option value={1}>Título 1</option>
                                <option value={2}>Título 2</option>
                                <option value={3}>Título 3</option>
                                <option value={4}>Título 4</option>
                                <option value={5}>Título 5</option>
                            </select>
                        </div>
                    )}

                    <div className="flex border-r pr-2 mr-1">
                        {toolbar.includes('Bold') && (
                            <button
                                onClick={() => editor.chain().focus().toggleBold().run()}
                                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200 text-blue-600' : ''}`}
                                title="Negrito" type="button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"/>
                                </svg>
                            </button>
                        )}
                        {toolbar.includes('Italic') && (
                            <button
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200 text-blue-600' : ''}`}
                                title="Itálico" type="button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"/>
                                </svg>
                            </button>
                        )}
                        {toolbar.includes('Underline') && (
                            <button
                                onClick={() => editor.chain().focus().toggleUnderline().run()}
                                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-gray-200 text-blue-600' : ''}`}
                                title="Sublinhado" type="button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57s-2.687-1.08-2.687-2.57zM12.5 15h-9v-1h9z"/>
                                </svg>
                            </button>
                        )}
                    </div>

                    {toolbar.includes('List') && (
                        <>
                            <button
                                onClick={() => editor.chain().focus().toggleBulletList().run()}
                                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200 text-blue-600' : ''}`}
                                title="Lista com marcadores" type="button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                                </svg>
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200 text-blue-600' : ''}`}
                                title="Lista numerada" type="button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338v.041zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635V5z"/>
                                </svg>
                            </button>
                        </>
                    )}

                    {toolbar.includes('Link') && (
                        <>
                            <button
                                onClick={openLinkModal}
                                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-200 text-blue-600' : ''}`}
                                title="Inserir link" type="button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
                                    <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"/>
                                </svg>
                            </button>

                            {showLinkModal && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="animate-fade-in-down [animation-duration:_0.1s] rounded-sm border border-stroke bg-white w-full max-w-md p-8 shadow-md relative">
                                        <h3 className="text-lg font-medium mb-4">Inserir link</h3>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">URL do link</label>
                                            <input
                                                type="text"
                                                value={linkUrl}
                                                onChange={(e) => setLinkUrl(e.target.value)}
                                                placeholder="https://exemplo.com"
                                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                autoFocus
                                            />
                                        </div>
                                        <div className="mb-4 flex items-center">
                                            <input
                                                type="checkbox"
                                                id="newTab"
                                                checked={openInNewTab}
                                                onChange={(e) => setOpenInNewTab(e.target.checked)}
                                                className="mr-2"
                                            />
                                            <label htmlFor="newTab" className="text-sm text-gray-700">Abrir em nova guia</label>
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                            {editor.isActive('link') && (
                                                <button onClick={removeLink} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                                                    Remover link
                                                </button>
                                            )}
                                            <button onClick={() => setShowLinkModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                                                Cancelar
                                            </button>
                                            <button onClick={insertLink} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                                Confirmar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {toolbar.includes('Image') && (
                        <>
                            <span className="border-l h-8 ml-1" />
                            <button
                                className="p-2 rounded hover:bg-gray-200 ml-1"
                                title="Inserir Imagem" type="button"
                                onClick={() => setShowImageModal(true)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                    <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
                                </svg>
                            </button>

                            {showImageModal && (
                                <ImageUploadModal
                                    onImageSelect={handleImageSelect}
                                    onClose={() => setShowImageModal(false)}
                                />
                            )}
                        </>
                    )}

                    {toolbar.includes('Table') && (
                        <div>
                            <button
                                ref={gridRef}
                                onClick={() => setShowGrid(!showGrid)}
                                className="flex gap-1 items-center p-2 rounded hover:bg-gray-200"
                                title="Inserir Tabela" type="button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 2h-4v3h4zm0 4h-4v3h4zm0 4h-4v3h3a1 1 0 0 0 1-1zm-5 3v-3H6v3zm-5 0v-3H1v2a1 1 0 0 0 1 1zm-4-4h4V8H1zm0-4h4V4H1zm5-3v3h4V4zm4 4H6v3h4z"/>
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M12.293 6.293a1 1 0 0 0-1.414 0L8 9.586 5.121 6.707a1 1 0 0 0-1.414 1.414l3.5 3.5a1 1 0 0 0 1.414 0l3.5-3.5a1 1 0 0 0 0-1.414z"/>
                                </svg>
                            </button>
                            {showGrid && (
                                <div className="absolute bg-white border p-2 shadow-md mt-2 z-[1]">
                                    <table className="border-collapse">
                                        <tbody>
                                            {Array.from({ length: 10 }, (_, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    {Array.from({ length: 10 }, (_, colIndex) => (
                                                        <td
                                                            key={colIndex}
                                                            className={`w-4 h-4 border cursor-pointer ${
                                                                (rowIndex <= hoveredCell?.row && colIndex <= hoveredCell?.col) ? 'bg-blue-200' : ''
                                                            }`}
                                                            onClick={() => handleInsertTable(rowIndex + 1, colIndex + 1)}
                                                            onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                                                            onMouseLeave={() => setHoveredCell(null)}
                                                        />
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <span className={`block text-center${!hoveredCell ? ' opacity-0' : ''}`}>
                                        {`${(hoveredCell?.row ?? 0) + 1} x ${(hoveredCell?.col ?? 0) + 1}`}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex">
                        <button
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={!editor.can().undo()}
                            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
                            title="Desfazer" type="button"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
                                <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
                            </svg>
                        </button>
                        <button
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={!editor.can().redo()}
                            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
                            title="Refazer" type="button"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                            </svg>
                        </button>
                    </div>
                </div>

                {toolbar.includes('Table') && <TableToolbar editor={editor} />}

                <div ref={editorWrapperRef} className="p-3 min-h-40 overflow-auto max-h-screen">
                    <EditorContent
                        editor={editor}
                        className="[&_.ProseMirror]:min-h-[8.5em] [&_p]:text-sm [&_h1]:text-4xl [&_h2]:text-3xl [&_h3]:text-2xl [&_h4]:text-xl [&_h5]:text-base [&_th]:border [&_td]:border [&_ul]:list-inside [&_ul_li]:list-disc [&_ul>li>p]:inline [&_ul>li>p]:my-0 [&_ol]:list-inside [&_ol_li]:list-decimal [&_ol>li>p]:inline [&_ol>li>p]:my-0 [&_a]:underline [&_a]:text-blue-500 [&_.ProseMirror-focused]:outline-none [&_img]:cursor-pointer"
                    />
                </div>

                {max !== null && (
                    <div className={`px-3 py-1 text-right text-xs border-t ${contentLength > max * 0.9 ? 'text-red-500' : 'text-gray-400'}`}>
                        {contentLength}/{max}
                    </div>
                )}
            </div>

            {showImageEditModal && (
                <ImageEditModal
                    node={editingImageNode}
                    onConfirm={handleImageEditConfirm}
                    onClose={() => {
                        setShowImageEditModal(false);
                        setEditingImageNode(null);
                        setEditingImagePos(null);
                    }}
                />
            )}
        </div>
    );
};
