import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWineGlass } from '@fortawesome/free-solid-svg-icons';

import AdminLayout from '@/Layouts/AdminLayout';
import { Breadcrumb } from '@/Components/Manager/Breadcrumb';
import { ConfirmModal } from '@/Components/Manager/ConfirmModal';
import { PageSettings } from '@/Components/Manager/PageSettings';
import { FormContent } from '@/Components/Manager/FormContent';
import { BlockContent } from '@/Components/Manager/BlockContent';

const Page = () => {
    // Content
    const { pagina, conteudos, idioma, idiomas, experiencias } = usePage().props;

    const breadcrumbItems = [
        // { label: 'Home', link: 'Home.index' },
        // { label: 'Projects', link: 'Home.index' },
    ];

    const contentExperiences = {
        nome: ['Experiências', 'experiência'],
        controller: 'Experiencias',
        imagens: true,
        imgClass: '',
        editavel: true,
        conteudos: experiencias,
    };
    return (
        <AdminLayout>
            <Breadcrumb icon={faWineGlass} items={breadcrumbItems} current="Enoturismo" idioma={idioma.codigo} idiomas={idiomas} />
            <PageSettings page={pagina} idioma={idioma.codigo} />

            <FormContent content={conteudos[0]} full={true} idioma={idioma.codigo} arqTipo="video" />

            <BlockContent content={contentExperiences} />

            <FormContent content={conteudos[1]} full={true} idioma={idioma.codigo} />
        </AdminLayout>
    );
};

export default Page;
