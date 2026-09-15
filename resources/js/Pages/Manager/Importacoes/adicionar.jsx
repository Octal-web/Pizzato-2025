import React from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import AdminLayout from '@/Layouts/AdminLayout';
import { Breadcrumb } from '@/Components/Manager/Breadcrumb';
import { InputCountry } from '@/Components/Manager/Inputs/InputCountry';
import { FormGroup } from '@/Components/Manager/Inputs/FormGroup';

const Page = () => {
    const { idioma } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({ pais: '', descricao: '' });

    const breadcrumbItems = [
        { label: 'Importações', link: 'Manager.Importacoes.index' },
    ];

    const inputItems = [
        [{ titulo: 'Descrição', name: 'descricao', tamanho: 'col-span-12 lg:col-span-8', tipo: 'texto_longo', editor: true, 'toolbar': ['Bold', 'Italic', 'List', 'Link'], max: 1080 }],
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('Manager.Importacoes.novo'), {
            preserveScroll: true
        });

    };

    const onChange = (name, value) => {
        setData(name, value);
    };

    return (
        <AdminLayout>
            <Breadcrumb icon={faGlobe} items={breadcrumbItems} current="Adicionar" idioma={idioma.codigo} />

            <div className="mb-6 rounded-sm border border-stroke bg-white px-5 py-5 shadow-md">
                <div className="mt-10">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-12 gap-x-6">
                            <InputCountry value={data.pais} onChange={onChange} error={errors.pais} />
                        </div>
                        {inputItems.map((group, groupIndex) => (
                            <div key={groupIndex} className="grid grid-cols-12 gap-x-6">
                                {group.map((input, index) => (
                                    <div key={index} className={`w-full ${input.tamanho}`}>
                                        <FormGroup
                                            input={input}
                                            idioma={idioma}
                                            value={data[input.name]}
                                            onChange={onChange}
                                        />
                                        {errors[input.name] && <p className="text-sm text-red-500 -mt-5 mb-3">{errors[input.name]}</p>}
                                    </div>
                                ))}
                            </div>
                        ))}

                        <div className="flex items-center justify-end">
                            <Link href={route('Manager.Importacoes.index')} className="flex items-center w-fit rounded-lg border border-red-700 text-red-700 px-3 py-2 mr-3 cursor-pointer transition-all hover:bg-red-100">
                                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                                Voltar
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="block relative w-fit rounded-lg border border-gray-300 px-3 py-2 cursor-pointer transition-all hover:bg-slate-200"
                            >   
                                <FontAwesomeIcon icon={faSave} className="text-slate-700 mr-2" />
                                Salvar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Page;
