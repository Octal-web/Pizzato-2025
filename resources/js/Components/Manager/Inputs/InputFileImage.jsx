import { useCallback, useEffect, useRef, useState } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { faImage, faTrash, faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const InputFileImage = ({
    title,
    name,
    imagem,
    size,
    allowCrop,
    onImageCrop,
}) => {
    const [crop, setCrop] = useState(null);
    const [showCurrentImage, setShowCurrentImage] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileExtension, setFileExtension] = useState(null);

    const imageRef = useRef(null);

    const getImageFormat = useCallback((extension) => {
        const normalizedExtension = extension?.toLowerCase();

        if (normalizedExtension === "jpg" || normalizedExtension === "jpeg") {
            return {
                mimeType: "image/jpeg",
                extension: "jpg",
                quality: 0.85,
            };
        }

        if (normalizedExtension === "webp") {
            return {
                mimeType: "image/webp",
                extension: "webp",
                quality: 0.82,
            };
        }

        return {
            mimeType: "image/png",
            extension: "png",
            quality: undefined,
        };
    }, []);

    const getExtensionFromMimeType = useCallback((mimeType) => {
        if (mimeType === "image/jpeg") {
            return "jpg";
        }

        if (mimeType === "image/webp") {
            return "webp";
        }

        return "png";
    }, []);

    const createImageFile = useCallback(
        (blob, fileName) => {
            const actualMimeType = blob.type || "image/png";
            const actualExtension = getExtensionFromMimeType(actualMimeType);

            return {
                file: new File([blob], `${fileName}.${actualExtension}`, {
                    type: actualMimeType,
                    lastModified: Date.now(),
                }),
                extension: actualExtension,
            };
        },
        [getExtensionFromMimeType],
    );

    const getResizedImg = useCallback(
        (imageSrc, extension) => {
            const image = new Image();
            const outputFormat = getImageFormat(extension);

            image.onload = () => {
                const originalWidth = image.naturalWidth;
                const originalHeight = image.naturalHeight;

                const scaleX = size.largura / originalWidth;
                const scaleY = size.altura / originalHeight;
                const scale = Math.min(scaleX, scaleY, 1);

                const scaledWidth = Math.max(
                    1,
                    Math.round(originalWidth * scale),
                );
                const scaledHeight = Math.max(
                    1,
                    Math.round(originalHeight * scale),
                );

                const canvas = document.createElement("canvas");

                canvas.width = scaledWidth;
                canvas.height = scaledHeight;

                const ctx = canvas.getContext("2d");

                if (!ctx) {
                    console.error(
                        "Não foi possível criar o contexto do canvas.",
                    );
                    return;
                }

                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = "high";

                if (outputFormat.mimeType === "image/jpeg") {
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(0, 0, scaledWidth, scaledHeight);
                } else {
                    ctx.clearRect(0, 0, scaledWidth, scaledHeight);
                }

                ctx.drawImage(
                    image,
                    0,
                    0,
                    originalWidth,
                    originalHeight,
                    0,
                    0,
                    scaledWidth,
                    scaledHeight,
                );

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            console.error(
                                "Não foi possível gerar a imagem redimensionada.",
                            );
                            return;
                        }

                        const result = createImageFile(blob, "resizedImage");

                        onImageCrop(result.file, result.extension, name);
                    },
                    outputFormat.mimeType,
                    outputFormat.quality,
                );
            };

            image.onerror = () => {
                console.error(
                    "Não foi possível carregar a imagem selecionada.",
                );
            };

            image.src = imageSrc;
        },
        [
            createImageFile,
            getImageFormat,
            name,
            onImageCrop,
            size.altura,
            size.largura,
        ],
    );

    const getCroppedImg = useCallback(
        (image, completedCrop, extension) => {
            const outputFormat = getImageFormat(extension);

            return new Promise((resolve, reject) => {
                const scaleX = image.naturalWidth / image.width;
                const scaleY = image.naturalHeight / image.height;

                const cropX = completedCrop.x * scaleX;
                const cropY = completedCrop.y * scaleY;
                const cropWidth = completedCrop.width * scaleX;
                const cropHeight = completedCrop.height * scaleY;

                const safeX = Math.max(0, Math.min(cropX, image.naturalWidth));
                const safeY = Math.max(0, Math.min(cropY, image.naturalHeight));
                const safeWidth = Math.min(
                    cropWidth,
                    image.naturalWidth - safeX,
                );
                const safeHeight = Math.min(
                    cropHeight,
                    image.naturalHeight - safeY,
                );

                if (safeWidth <= 0 || safeHeight <= 0) {
                    reject(
                        new Error(
                            "A área selecionada para o corte é inválida.",
                        ),
                    );
                    return;
                }

                const canvas = document.createElement("canvas");

                canvas.width = size.largura;
                canvas.height = size.altura;

                const ctx = canvas.getContext("2d");

                if (!ctx) {
                    reject(
                        new Error(
                            "Não foi possível criar o contexto do canvas.",
                        ),
                    );
                    return;
                }

                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = "high";

                if (outputFormat.mimeType === "image/jpeg") {
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(0, 0, size.largura, size.altura);
                } else {
                    ctx.clearRect(0, 0, size.largura, size.altura);
                }

                ctx.drawImage(
                    image,
                    Math.floor(safeX),
                    Math.floor(safeY),
                    Math.ceil(safeWidth),
                    Math.ceil(safeHeight),
                    0,
                    0,
                    size.largura,
                    size.altura,
                );

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(
                                new Error(
                                    "Não foi possível gerar a imagem recortada.",
                                ),
                            );
                            return;
                        }

                        const result = createImageFile(blob, "croppedImage");

                        resolve(result);
                    },
                    outputFormat.mimeType,
                    outputFormat.quality,
                );
            });
        },
        [createImageFile, getImageFormat, size.altura, size.largura],
    );

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const extensionFromName = file.name.split(".").pop()?.toLowerCase();
        const extensionFromMime = getExtensionFromMimeType(file.type);
        const extension = extensionFromName || extensionFromMime;
        const fileUrl = URL.createObjectURL(file);

        setCrop(null);
        setSelectedFile(fileUrl);
        setFileExtension(extension);
        setShowCurrentImage(false);

        if (!allowCrop) {
            getResizedImg(fileUrl, extension);
        }

        event.target.value = "";
    };

    const removeAll = () => {
        setCrop(null);
        setSelectedFile(null);
        setShowCurrentImage(true);
        setFileExtension(null);

        imageRef.current = null;

        onImageCrop(null, null, name);
    };

    const onImageLoad = (event) => {
        imageRef.current = event.currentTarget;

        if (!allowCrop) {
            return;
        }

        const { naturalWidth: width, naturalHeight: height } =
            event.currentTarget;

        const initialCrop = centerCrop(
            makeAspectCrop(
                {
                    unit: "%",
                    width: 90,
                },
                size.largura / size.altura,
                width,
                height,
            ),
            width,
            height,
        );

        setCrop(initialCrop);
    };

    const onCropComplete = useCallback(
        async (completedCrop) => {
            if (
                !completedCrop?.width ||
                !completedCrop?.height ||
                !imageRef.current ||
                !fileExtension
            ) {
                return;
            }

            try {
                const result = await getCroppedImg(
                    imageRef.current,
                    completedCrop,
                    fileExtension,
                );

                onImageCrop(result.file, result.extension, name);
            } catch (error) {
                console.error("Erro ao recortar imagem:", error);
            }
        },
        [fileExtension, getCroppedImg, name, onImageCrop],
    );

    useEffect(() => {
        return () => {
            if (selectedFile) {
                URL.revokeObjectURL(selectedFile);
            }
        };
    }, [selectedFile]);

    return (
        <div className="mb-6">
            <label className="mb-2 block font-bold text-gray-500">
                {title}
            </label>

            <div>
                {showCurrentImage ? (
                    <div className="border border-gray-300 rounded-lg max-w-md mb-1 w-fit">
                        <img
                            src={imagem}
                            className="rounded-lg bg-checkered max-h-[70vh]"
                            alt="Imagem atual"
                        />
                    </div>
                ) : allowCrop ? (
                    <ReactCrop
                        crop={crop}
                        onChange={setCrop}
                        aspect={size.largura / size.altura}
                        onComplete={onCropComplete}
                    >
                        <img
                            src={selectedFile}
                            alt="Imagem selecionada"
                            onLoad={onImageLoad}
                            className="rounded-lg border bg-checkered"
                        />
                    </ReactCrop>
                ) : (
                    <img
                        src={selectedFile}
                        alt="Imagem selecionada"
                        className="rounded-lg border bg-checkered"
                    />
                )}

                {selectedFile ? (
                    <div className="flex mt-2">
                        <div>
                            <label
                                htmlFor={name}
                                className="btn-file block relative w-fit rounded-lg border border-gray-300 px-3 py-2 cursor-pointer transition-all hover:bg-slate-200"
                            >
                                <div className="w-fit">
                                    <FontAwesomeIcon
                                        icon={faUndo}
                                        className="text-gray-500 mr-1"
                                    />
                                    Trocar
                                </div>

                                <input
                                    id={name}
                                    name={name}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </label>
                        </div>

                        <div>
                            <button
                                type="button"
                                className="btn-file block relative w-fit rounded-lg border border-red-500 bg-red-500 px-3 py-2 ml-2 cursor-pointer text-white transition-all hover:bg-red-700"
                                onClick={removeAll}
                            >
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    className="mr-1"
                                />
                                Remover
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <label
                            htmlFor={name}
                            className="btn-file block relative w-fit rounded-lg border border-gray-300 px-3 py-2 cursor-pointer transition-all hover:bg-slate-200"
                        >
                            <div className="w-fit">
                                <FontAwesomeIcon
                                    icon={faImage}
                                    className="text-gray-500 mr-1"
                                />
                                Selecionar imagem
                            </div>

                            <input
                                id={name}
                                name={name}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </label>
                    </div>
                )}

                <div className="flex items-center space-x-2 text-xs text-gray-700 mt-4">
                    <span className="bg-orange-500 text-white font-bold px-2 py-1 rounded">
                        TAMANHO!
                    </span>

                    <span>
                        A imagem deve ter no mínimo{" "}
                        <span className="font-bold">{size.largura}px</span> de
                        largura e{" "}
                        <span className="font-bold">{size.altura}px</span> de
                        altura.
                    </span>
                </div>
            </div>
        </div>
    );
};
