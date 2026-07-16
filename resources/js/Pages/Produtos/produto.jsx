import React, { useState, useEffect } from 'react';
import { usePage, Link, router } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { ProductFirstFold } from '@/Components/ProductFirstFold';
import { ProductSecondFold } from '@/Components/ProductSecondFold';
import { ProductDetails } from '@/Components/ProductDetails';
import { ProductFooter } from '@/Components/ProductFooter';

const Page = () => {
    const { produto } = usePage().props;

    return (
        <DefaultLayout>
            <ProductFirstFold line={produto.linha_logo} name={produto.nome} image={produto.imagem} description={produto.descricao} volumes={produto.volumes} />
            <ProductSecondFold id={produto.id} features={produto.destaques} image={produto.imagem_destaques} color={produto.cor} harvest={produto.colheitas} files={produto.arquivos} />
            <ProductDetails details={produto.detalhes} />
            <ProductFooter banner={produto.banner_rodape} />
        </DefaultLayout>
    );
};

export default Page;