import React from 'react';
import { usePage, Link } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { TourismBanner } from '@/Components/TourismBanner';
import { TourismExperience } from '@/Components/TourismExperience';
import { TourismPath } from '@/Components/TourismPath';
import { TourismMessage } from '@/Components/TourismMessage';

const Page = () => {
    const { conteudos, experiencias } = usePage().props;

    return (
        <DefaultLayout>
            <TourismBanner content={conteudos[0]} />

            <section className="relative mt-10 md:mt-20 pt-20">
                <TourismPath />
                
                {experiencias.map((item, index) => (
                    <TourismExperience key={index} experience={item} index={index} />
                ))}
            </section>
            
                <TourismMessage content={conteudos[1]} />
        </DefaultLayout>
    );
};

export default Page;