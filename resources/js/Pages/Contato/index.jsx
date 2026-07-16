import React, { useState, useEffect } from 'react';
import { usePage, Link, router } from '@inertiajs/react';

import DefaultLayout from '@/Layouts/DefaultLayout';

import { ContactBanner } from '@/Components/ContactBanner';
import { ContactsData } from '@/Components/ContactsData';
import { ContactForm } from '@/Components/ContactForm';

const Page = () => {
    const { googleMapsKey, conteudos } = usePage().props;

    return (
        <DefaultLayout>
            <ContactBanner content={conteudos[0]} />
            <section className="mt-20 mb-16">
                <div className="container max-w-large">
                    <div className="md:flex">
                        <ContactsData apiKey={googleMapsKey} />
                        <ContactForm />
                    </div>
                </div>
            </section>
        </DefaultLayout>
    );
};

export default Page;