import { Link, useForm, usePage } from "@inertiajs/react";

import {
    faArrowLeft,
    faCircleQuestion,
    faSave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Breadcrumb } from "@/Components/Manager/Breadcrumb";
import { FormGroup } from "@/Components/Manager/Inputs/FormGroup";
import AdminLayout from "@/Layouts/AdminLayout";

const Page = () => {
    const { idioma } = usePage().props;

    const { data, setData, post, errors } = useForm();

    const breadcrumbItems = [
        { label: "Perguntas", link: "Manager.Perguntas.index" },
    ];

    const inputItems = [
        [
            {
                titulo: "Pergunta",
                name: "titulo",
                tamanho: "col-span-12 lg:col-span-8",
                tipo: "texto",
                max: 255,
            },
            {
                titulo: "Resposta",
                name: "texto",
                tamanho: "col-span-12 lg:col-span-8",
                tipo: "texto_longo",
                max: 600,
                editor: true,
                toolbar: ['Italic', 'Bold', 'Underline', 'Link']
            },
        ],
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("Manager.Perguntas.novo"), {
            preserveScroll: true,
        });
    };

    const onChange = (name, value) => {
        setData(name, value);
    };

    return (
        <AdminLayout>
            <Breadcrumb
                icon={faCircleQuestion}
                items={breadcrumbItems}
                current="Adicionar"
                idioma={idioma.codigo}
            />

            <div className="mb-6 rounded-sm border border-stroke bg-white px-5 py-5 shadow-md">
                <div className="mt-10">
                    <form onSubmit={handleSubmit}>
                        {inputItems.map((group, groupIndex) => (
                            <div
                                key={groupIndex}
                                className="grid grid-cols-12 gap-x-6"
                            >
                                {group.map((input, index) => (
                                    <div
                                        key={index}
                                        className={`w-full ${input.tamanho}`}
                                    >
                                        <FormGroup
                                            input={input}
                                            idioma={idioma}
                                            value={data[input.name]}
                                            onChange={onChange}
                                        />
                                        {errors[input.name] && (
                                            <p className="text-sm text-red-500 -mt-5 mb-3">
                                                {errors[input.name]}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}

                        <div className="flex items-center justify-end">
                            <Link
                                href={route("Manager.Perguntas.index")}
                                className="flex items-center w-fit rounded-lg border border-red-700 text-red-700 px-3 py-2 mr-3 cursor-pointer transition-all hover:bg-red-100"
                            >
                                <FontAwesomeIcon
                                    icon={faArrowLeft}
                                    className="mr-2"
                                />
                                Voltar
                            </Link>

                            <button
                                type="submit"
                                className="block relative w-fit rounded-lg border border-gray-300 px-3 py-2 cursor-pointer transition-all hover:bg-slate-200"
                            >
                                <FontAwesomeIcon
                                    icon={faSave}
                                    className="text-slate-700 mr-2"
                                />
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
