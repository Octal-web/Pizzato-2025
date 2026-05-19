import React from 'react';
import { Link } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChevronLeft, 
    faChevronRight,
    faEllipsisH
} from '@fortawesome/free-solid-svg-icons';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) {
        return null;
    }

    const renderPageLink = (link, index) => {
        // Link "Anterior"
        if (index === 0) {
            return (
                <PaginationLink
                    key={index}
                    href={link.url}
                    disabled={!link.url}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FontAwesomeIcon icon={faChevronLeft} className="mr-1" />
                    Anterior
                </PaginationLink>
            );
        }

        // Link "Próximo"
        if (index === links.length - 1) {
            return (
                <PaginationLink
                    key={index}
                    href={link.url}
                    disabled={!link.url}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Próximo
                    <FontAwesomeIcon icon={faChevronRight} className="ml-1" />
                </PaginationLink>
            );
        }

        // Links de páginas numeradas
        const isActive = link.active;
        const isEllipsis = link.label === '...';

        if (isEllipsis) {
            return (
                <span
                    key={index}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300"
                >
                    <FontAwesomeIcon icon={faEllipsisH} />
                </span>
            );
        }

        return (
            <PaginationLink
                key={index}
                href={link.url}
                disabled={!link.url}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium border border-gray-300 ${
                    isActive
                        ? 'bg-blue-600 text-white border-blue-600 z-10'
                        : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
                {link.label}
            </PaginationLink>
        );
    };

    return (
        <nav className="flex items-center justify-between px-4 sm:px-0" aria-label="Pagination">
            {/* Info da paginação - visível apenas em telas maiores */}
            <div className="hidden sm:block">
                <p className="text-sm text-gray-700">
                    Mostrando página {getCurrentPage(links)} de {getTotalPages(links)}
                </p>
            </div>

            {/* Links de paginação */}
            <div className="flex-1 flex justify-center sm:justify-end">
                <div className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    {links.map((link, index) => renderPageLink(link, index))}
                </div>
            </div>
        </nav>
    );
}

// Componente auxiliar para renderizar links
function PaginationLink({ href, disabled, className, children, ...props }) {
    if (disabled || !href) {
        return (
            <span className={`${className} cursor-not-allowed opacity-50`} {...props}>
                {children}
            </span>
        );
    }

    return (
        <Link
            href={href}
            className={`${className} transition-colors duration-200`}
            preserveState
            {...props}
        >
            {children}
        </Link>
    );
}

// Função auxiliar para obter a página atual
function getCurrentPage(links) {
    const activeLink = links.find(link => link.active && link.label !== '...');
    return activeLink ? activeLink.label : '1';
}

// Função auxiliar para obter o total de páginas
function getTotalPages(links) {
    // Remove os links "Anterior" e "Próximo" e encontra o maior número
    const pageNumbers = links
        .slice(1, -1) // Remove primeiro e último (Anterior e Próximo)
        .filter(link => link.label !== '...' && !isNaN(link.label))
        .map(link => parseInt(link.label));
    
    return pageNumbers.length > 0 ? Math.max(...pageNumbers) : '1';
}