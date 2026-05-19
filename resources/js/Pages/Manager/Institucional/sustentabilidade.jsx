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

const Page = () => {
    // Content
    const { pagina, conteudos, idioma, idiomas } = usePage().props;

    const breadcrumbItems = [
        { label: 'Institucional', link: 'Institucional.index' },
    ];

    return (
        <AdminLayout>
            <Breadcrumb icon={faHome} items={breadcrumbItems} current="Sustentabilidade" idioma={idioma.codigo} idiomas={idiomas} />
            <PageSettings page={pagina} idioma={idioma.codigo} />
            
            <FormContent content={conteudos[0]} full={true} idioma={idioma.codigo} />
            
            <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
                <FormContent content={conteudos[1]} full={false} idioma={idioma.codigo} />
                
                <FormContent content={conteudos[2]} full={false} idioma={idioma.codigo} />
            </div>
            
            <FormContent content={conteudos[3]} full={true} idioma={idioma.codigo} />

            <FormContent content={conteudos[4]} full={true} idioma={idioma.codigo} />

            <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
                <FormContent content={conteudos[5]} full={false} idioma={idioma.codigo} />

                <FormContent content={conteudos[6]} full={false} idioma={idioma.codigo} />
            </div>
        </AdminLayout>
    );
};

export default Page;
