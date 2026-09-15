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

            <section className="relative bg-white pt-12 pb-12 md:pt-20 md:pb-24 lg:pt-28">
                <div className="container max-w-large grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-x-12 lg:gap-y-12 lg:gap-y-20">
                    {importacoes.map(item => <ImportsItem key={item.id} item={item} />)}
                </div>
            </section>
        </DefaultLayout>
    );
};

export default Page;
