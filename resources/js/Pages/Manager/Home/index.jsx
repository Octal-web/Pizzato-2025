import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

import AdminLayout from '@/Layouts/AdminLayout';
import { Breadcrumb } from '@/Components/Manager/Breadcrumb';
import { ConfirmModal } from '@/Components/Manager/ConfirmModal';
import { PageSettings } from '@/Components/Manager/PageSettings';
import { FormContent } from '@/Components/Manager/FormContent';
import { BlockContent } from '@/Components/Manager/BlockContent';
import { GeneralData } from '@/Components/Manager/GeneralData';

const Page = () => {
    // Content
    const { pagina, conteudos, idioma, idiomas, slides } = usePage().props;

    const breadcrumbItems = [
        // { label: 'Home', link: 'Home.index' },
        // { label: 'Projects', link: 'Home.index' },
    ];

    const contentSlides = {
        nome: ['Slides', 'slide'],
        controller: 'Slides',
        imagens: false,
        imgClass: '',
        editavel: true,
        conteudos: slides,
        addParametros: ['imagem', 'video']
    };
    return (
        <AdminLayout>
            <Breadcrumb icon={faHome} items={breadcrumbItems} current="Home" idioma={idioma.codigo} idiomas={idiomas} />
            <PageSettings page={pagina} idioma={idioma.codigo} />

            {/* <GeneralData /> */}

            <BlockContent content={contentSlides} />
            
            <FormContent content={conteudos[0]} full={true} idioma={idioma.codigo} />
            
            <FormContent content={conteudos[1]} full={true} idioma={idioma.codigo} />

            <FormContent content={conteudos[2]} full={true} idioma={idioma.codigo} />
            
            <FormContent content={conteudos[3]} full={true} idioma={idioma.codigo} />

            <FormContent content={conteudos[4]} full={true} idioma={idioma.codigo} />
        </AdminLayout>
    );
};

export default Page;
