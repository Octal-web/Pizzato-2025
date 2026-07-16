import React from 'react';
import { usePage, Link } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { AboutBanner } from '@/Components/AboutBanner';
import { AboutVineyard } from '@/Components/AboutVineyard';
import { AboutOrigin } from '@/Components/AboutOrigin';
import { AboutFooter } from '@/Components/AboutFooter';
// import { AboutToken } from '@/Components/AboutToken';
// import { AboutTokenList } from '@/Components/AboutTokenList';
// import { AboutTokenAccess } from '@/Components/AboutTokenAccess';

const Page = () => {
    const { conteudos, vinhedos, imagensGaleria } = usePage().props;

    return (
        <DefaultLayout>
            <AboutBanner content={conteudos[0]} />

            <AboutVineyard vineyard={vinhedos[0]} />

            <AboutOrigin content={conteudos[1]} images={imagensGaleria[conteudos[1].id]} />

            <AboutVineyard vineyard={vinhedos[1]} />

            <AboutFooter content={conteudos[2]} images={imagensGaleria[conteudos[2].id]} />

            {/* <AboutToken content={conteudos[2]} images={imagensGaleria[conteudos[2].id]} />

            <div className="relative grid grid-cols-2">
                <AboutTokenList content={conteudos[3]} />
                
                <AboutTokenAccess content={conteudos[4]} />
            </div> */}
        </DefaultLayout>
    );
};

export default Page;