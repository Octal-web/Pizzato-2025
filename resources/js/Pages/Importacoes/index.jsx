import React from 'react';
import { usePage } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { ImportsBanner } from '@/Components/ImportsBanner';
import { ImportsItem } from '@/Components/ImportsItem';

const Page = () => {
    const { conteudos = [], importacoes = [] } = usePage().props;

    return (
        <DefaultLayout>
            <ImportsBanner content={conteudos[0]} />

            <section className="relative bg-white pt-12 pb-12 md:pt-20 md:pb-20 lg:pt-24">
                {importacoes.map((item, index) => (
                    <ImportsItem key={item.id} index={index} item={item} />
                ))}
            </section>
        </DefaultLayout>
    );
};

export default Page;
