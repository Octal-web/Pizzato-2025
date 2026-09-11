import React from 'react';
import { usePage } from '@inertiajs/react';

import { faGlobe } from '@fortawesome/free-solid-svg-icons';

import AdminLayout from '@/Layouts/AdminLayout';
import { Breadcrumb } from '@/Components/Manager/Breadcrumb';
import { PageSettings } from '@/Components/Manager/PageSettings';
import { FormContent } from '@/Components/Manager/FormContent';
import { BlockContent } from '@/Components/Manager/BlockContent';

const Page = () => {
    // Content
    const { pagina, conteudos, idioma, idiomas, importacoes } = usePage().props;

    const breadcrumbItems = [
        // { label: 'Home', link: 'Home.index' },
        // { label: 'Projects', link: 'Home.index' },
    ];

    const contentImports = {
        nome: ['Importações', 'importação'],
        controller: 'Importacoes',
        imagens: true,
        imgClass: '',
        editavel: true,
        conteudos: importacoes,
    };
    return (
        <AdminLayout>
            <Breadcrumb icon={faGlobe} items={breadcrumbItems} current="Importações" idioma={idioma.codigo} idiomas={idiomas} />
            {pagina && <PageSettings page={pagina} idioma={idioma.codigo} />}

            <FormContent content={conteudos[0]} full={true} idioma={idioma.codigo} />

            <BlockContent content={contentImports} />

        </AdminLayout>
    );
};

export default Page;
