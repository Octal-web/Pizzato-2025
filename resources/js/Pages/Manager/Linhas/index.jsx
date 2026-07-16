import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';

import AdminLayout from '@/Layouts/AdminLayout';
import { Breadcrumb } from '@/Components/Manager/Breadcrumb';
import { ConfirmModal } from '@/Components/Manager/ConfirmModal';
import { PageSettings } from '@/Components/Manager/PageSettings';
import { FormContent } from '@/Components/Manager/FormContent';
import { BlockContent } from '@/Components/Manager/BlockContent';

const Page = () => {
    // Content
    const { idioma, idiomas, linhas, categorias, volumes } = usePage().props;

    const breadcrumbItems = [
        { label: 'Produtos', link: 'Manager.Produtos.index' },
    ];

    const contentLines = {
        nome: ['Linhas', 'linha'],
        controller: 'Linhas',
        imagens: false,
        imgClass: '',
        editavel: true,
        conteudos: linhas
    };

    const contentCategories = {
        nome: ['Categorias', 'categoria'],
        controller: 'Categorias',
        imagens: false,
        imgClass: '',
        editavel: true,
        conteudos: categorias
    };

    const contentVolumes = {
        nome: ['Volumes', 'volume'],
        controller: 'Volumes',
        imagens: false,
        imgClass: '',
        editavel: true,
        conteudos: volumes
    };

    return (
        <AdminLayout>
            <Breadcrumb icon={faList} items={breadcrumbItems} current="Linhas" idioma={idioma.codigo} idiomas={idiomas} />
            <BlockContent content={contentLines} />
            
            <BlockContent content={contentCategories} />
            
            <BlockContent content={contentVolumes} />
        </AdminLayout>
    );
};

export default Page;
