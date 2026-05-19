import React from 'react';
import { usePage, Link } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { AboutSustainBanner } from '@/Components/AboutSustainBanner';
import { AboutSustainText } from '@/Components/AboutSustainText';
import { AboutSustainAux } from '@/Components/AboutSustainAux';
import { AboutToken } from '@/Components/AboutToken';
import { AboutTokenList } from '@/Components/AboutTokenList';
import { AboutTokenAccess } from '@/Components/AboutTokenAccess';

const Page = () => {
    const { conteudos } = usePage().props;

    return (
        <DefaultLayout>
            <AboutSustainBanner content={conteudos[0]} />

            <AboutSustainText content={conteudos[1]} reverse={false} />

            <AboutSustainText content={conteudos[2]} reverse={true} />

            <AboutSustainAux content={conteudos[3]} />
            
            {/* <AboutToken content={conteudos[4]} />

            <div className="relative grid grid-cols-2">
                <AboutTokenList content={conteudos[5]} />
                
                <AboutTokenAccess content={conteudos[6]} />
            </div> */}
        </DefaultLayout>
    );
};

export default Page;