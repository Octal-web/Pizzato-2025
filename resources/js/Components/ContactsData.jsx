import React, { useEffect, useRef } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useLang } from "@/hooks/useLang";

import { Reveal } from './Reveal';
import { ContactMap } from './ContactMap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

export const ContactsData = ({ apiKey }) => {
    const lang = useLang();

    return (
        <Reveal className="md:w-1/2 md:pr-12 flex flex-col" direction="left">
            <h2 className="text-4xl md:text-5xl 2xl:text-[4em] text-secondary font-bold uppercase leading-none">{lang('fale')}</h2>
            <h1 className="text-6xl md:text-7xl 2xl:text-[5.6em] font-light uppercase leading-none -mt-1">{lang('conosco')}</h1>

            <div className="max-w-5xl font-secondary mt-10 md:mt-16">
                <h5 className="text-neutral-500 text-2xl font-bold mb-4">{lang('endereco')}:</h5>
                <div className="text-neutral-500 font-light mb-8">
                    {lang('endereco1')}<br />
                    {lang('endereco2')}<br />
                    {lang('endereco3')}<br />
                    {lang('endereco4')}
                </div>

                <ul className="mx-auto space-y-2 mb-10">
                    <li>
                        <a href="tel:+555430550440" className="text-sm underline transition-all opacity-70 hover:opacity-100">(54) 3055-0440</a>
                    </li>

                    <li>
                        <a href="tel:+5554981364858" className="text-sm underline transition-all opacity-70 hover:opacity-100">(54) 98136-4858</a>
                    </li>

                    <li>
                        <a target='_blank' href="https://wa.me/5554996497010" className="text-sm underline transition-all opacity-70 hover:opacity-100"> (54) 99649-7010 <FontAwesomeIcon icon={faWhatsapp}/></a>
                    </li>
                </ul>
            </div>

            <div className="mt-auto">
                <ContactMap apiKey={apiKey} />
            </div>
        </Reveal>
    );
};