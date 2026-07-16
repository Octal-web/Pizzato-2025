import React from 'react';
import { usePage } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { HomeSlides } from '@/Components/HomeSlides';
import { HomeGallery } from '@/Components/HomeGallery';
import { HomeLines } from '@/Components/HomeLines';
import { HomeVideo } from '@/Components/HomeVideo';
import { HomeProducts } from '@/Components/HomeProducts';
import { HomeHistory } from '@/Components/HomeHistory';
import { HomeNewsletter } from '@/Components/HomeNewsletter';

const Page = () => {
    const { slides, linhas, destaques, imagensGaleria, conteudos } = usePage().props;
    
    return (
        <DefaultLayout>
            <HomeSlides slides={slides} />

            <HomeGallery content={conteudos[0]} />

            <HomeLines lines={linhas} />

            <HomeVideo content={conteudos[1]} images={imagensGaleria[conteudos[1].id]} />

            <HomeProducts content={conteudos[2]} products={destaques} />

            <HomeHistory content={conteudos[3]} />

            <HomeNewsletter content={conteudos[4]} />
        </DefaultLayout>
    );
};

export default Page;
