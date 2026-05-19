import { Link, usePage } from '@inertiajs/react'
import { useEffect, useState, useRef } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

export const LanguageSwitcher = ({ isReverse }) => {
    const { idiomas, idioma } = usePage().props
    const [open, setOpen] = useState(false);
    
    const wrapperRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div ref={wrapperRef} className="relative w-fit ml-auto">
            <button
                onClick={() => setOpen(!open)}
                className={`flex items-center gap-2 font-secondary${isReverse ? ' text-black': ''}`}
            >
                {idioma.toUpperCase()}

                <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-xs transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
            </button>

            <div ref={contentRef} className="absolute right-0 mt-2 w-max bg-white shadow transition-all duration-500 ease-in-out overflow-hidden" style={{ maxHeight: open ? `${contentRef.current?.scrollHeight}px` : '0px'}}>
                {idiomas.map(locale => (
                    <Link
                        key={locale.codigo}
                        href={locale.url}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full"
                    >
                        <img src={`/site/img/flags/${locale.codigo}.png`} className="w-5 h-5" />
                        <span className="font-secondary text-black">{locale.codigo.toUpperCase()}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}