import React from 'react';
import { usePage } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { FaqDoubts } from '@/Components/FaqDoubts';

const Page = () => {
    const { perguntas } = usePage().props;

    return (
        <DefaultLayout>
            <FaqDoubts perguntas={perguntas} />
        </DefaultLayout>
    );
};

export default Page;