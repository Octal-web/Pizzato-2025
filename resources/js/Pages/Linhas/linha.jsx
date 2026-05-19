import React, { useState, useEffect } from 'react';
import { usePage, Link, router } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { LinesBanner } from '@/Components/LinesBanner';
import { ProductsList } from '@/Components/ProductsList';

const Page = () => {
    const { conteudos, linha, linhasMenu } = usePage().props;
    const [hasChanged, setHasChanged] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSlugChange = (slug) => {
        setLoading(true);
        router.get(
            route('Linhas.linha', {slug: slug}),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                only: ['pagina', 'linha'],
                onSuccess: () => {
                    setLoading(false);
                },
            }
        );
    };

    return (
        <DefaultLayout>
            <LinesBanner 
                current={linha}
                lines={linhasMenu}
                onChangeSlug={handleSlugChange}
            />

            <section className="mt-20 mb-30">
                <div className="container max-w-large">
                    <ProductsList hasAside={false} line={linha} loading={loading} />
                </div>
            </section>
        </DefaultLayout>
    );
};

export default Page;