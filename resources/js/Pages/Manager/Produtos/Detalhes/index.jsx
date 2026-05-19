import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';

import AdminLayout from '@/Layouts/AdminLayout';
import { Breadcrumb } from '@/Components/Manager/Breadcrumb';
import { BlockContent } from '@/Components/Manager/BlockContent';

const Page = () => {
    // Content
    const { idioma, idiomas, produto } = usePage().props;

    const breadcrumbItems = [
        { label: 'Produtos', link: 'Manager.Produtos.index' },
        { label: produto.nome, link: 'Manager.Produtos.editar', params: { id: produto.id }},
    ];

    const contentDetails = {
        nome: ['Detalhes', 'detalhe'],
        controller: 'Produtos.Detalhes',
        imagens: true,
        imgClass: 'object-none',
        addId: produto.id,
        editavel: true,
        conteudos: produto.detalhes
    };

    return (
        <AdminLayout>
            <Breadcrumb icon={faList} items={breadcrumbItems} current="Detalhes" idioma={idioma.codigo} idiomas={idiomas} id={produto.id} />

            <BlockContent content={contentDetails} />
        </AdminLayout>
    );
};

export default Page;
