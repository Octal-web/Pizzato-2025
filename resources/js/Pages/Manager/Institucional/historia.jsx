import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimeline } from '@fortawesome/free-solid-svg-icons';

import AdminLayout from '@/Layouts/AdminLayout';
import { Breadcrumb } from '@/Components/Manager/Breadcrumb';
import { ConfirmModal } from '@/Components/Manager/ConfirmModal';
import { PageSettings } from '@/Components/Manager/PageSettings';
import { FormContent } from '@/Components/Manager/FormContent';
import { BlockContent } from '@/Components/Manager/BlockContent';

const Page = () => {
    // Content
    const { pagina, idioma, idiomas, acontecimentos } = usePage().props;
    
    const breadcrumbItems = [
        { label: 'Institucional', link: 'Institucional.index' },
    ];

    const contentTimeline = {
        nome: ['Linha do Tempo', 'acontecimento'],
        controller: 'Acontecimentos',
        imagens: true,
        imgClass: '',
        editavel: true,
        conteudos: acontecimentos
    };

    return (
        <AdminLayout>
            <Breadcrumb icon={faTimeline} items={breadcrumbItems} current="História" idioma={idioma.codigo} idiomas={idiomas} />
            <PageSettings page={pagina} idioma={idioma.codigo} />

            <BlockContent content={contentTimeline} />
        </AdminLayout>
    );
};

export default Page;
