// Utilitários para manipulação de arquivos

/**
 * Obtém a extensão de um arquivo
 * @param {string} filename - Nome do arquivo
 * @returns {string} Extensão em lowercase
 */
export const getFileExtension = (filename) => {
    return filename.toLowerCase().split('.').pop();
};

/**
 * Determina o tipo de arquivo para visualização
 * @param {object} file - Objeto do arquivo
 * @returns {string} Tipo do arquivo (image, text, pdf, docx, unsupported)
 */
export const getFileType = (file) => {
    const ext = getFileExtension(file.name);
    
    // Imagens
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico'].includes(ext)) {
        return 'image';
    }
    
    // Textos
    if (['txt', 'md', 'csv', 'json', 'xml', 'log', 'ini', 'cfg', 'yaml', 'yml', 'js', 'css', 'html', 'php', 'py', 'java', 'c', 'cpp', 'h'].includes(ext)) {
        return 'text';
    }
    
    // PDFs
    if (ext === 'pdf') {
        return 'pdf';
    }
    
    // Documentos Word
    if (['docx', 'doc'].includes(ext)) {
        return 'docx';
    }
    
    // Planilhas (para futuro uso)
    if (['xlsx', 'xls'].includes(ext)) {
        return 'spreadsheet';
    }
    
    // Apresentações (para futuro uso)
    if (['pptx', 'ppt'].includes(ext)) {
        return 'presentation';
    }
    
    return 'unsupported';
};

/**
 * Verifica se um arquivo pode ser visualizado
 * @param {object} file - Objeto do arquivo
 * @returns {boolean} True se o arquivo pode ser visualizado
 */
export const isViewableFile = (file) => {
    if (file.type === "folder") return false;
    return getFileType(file) !== 'unsupported';
};

/**
 * Obtém o ícone apropriado para o tipo de arquivo
 * @param {object} file - Objeto do arquivo
 * @returns {string} Emoji do ícone
 */
export const getFileIcon = (file) => {
    if (file.type === "folder") return "📁";
    
    const fileType = getFileType(file);
    const ext = getFileExtension(file.name);
    
    switch (fileType) {
        case 'image':
            return '🖼️';
        case 'text':
            if (['js', 'json'].includes(ext)) return '📜';
            if (['css'].includes(ext)) return '🎨';
            if (['html', 'xml'].includes(ext)) return '🌐';
            if (['py'].includes(ext)) return '🐍';
            if (['java'].includes(ext)) return '☕';
            return '📝';
        case 'pdf':
            return '📄';
        case 'docx':
            return '📘';
        case 'spreadsheet':
            return '📊';
        case 'presentation':
            return '📋';
        default:
            return '📄';
    }
};

/**
 * Formata o tamanho do arquivo
 * @param {number} bytes - Tamanho em bytes
 * @returns {string} Tamanho formatado
 */
export const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * Formata a data de modificação
 * @param {number} timestamp - Timestamp Unix
 * @returns {string} Data formatada
 */
export const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Obtém a cor de fundo baseada no tipo de arquivo
 * @param {object} file - Objeto do arquivo
 * @returns {string} Classe CSS para cor de fundo
 */
export const getFileColor = (file) => {
    if (file.type === "folder") return "bg-yellow-50 border-yellow-200";
    
    const fileType = getFileType(file);
    
    switch (fileType) {
        case 'image':
            return 'bg-purple-50 border-purple-200';
        case 'text':
            return 'bg-blue-50 border-blue-200';
        case 'pdf':
            return 'bg-red-50 border-red-200';
        case 'docx':
            return 'bg-blue-50 border-blue-200';
        case 'spreadsheet':
            return 'bg-green-50 border-green-200';
        case 'presentation':
            return 'bg-orange-50 border-orange-200';
        default:
            return 'bg-gray-50 border-gray-200';
    }
};