import React from 'react';
import { usePage, Link } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { HistoryBanner } from '@/Components/HistoryBanner';
import { HistorySlides } from '@/Components/HistorySlides';

const Page = () => {
    const { conteudos, acontecimentos } = usePage().props;

    return (
        <DefaultLayout>
            <HistoryBanner content={conteudos[0]} />

            <HistorySlides slides={acontecimentos} />
        </DefaultLayout>
    );
};

export default Page;