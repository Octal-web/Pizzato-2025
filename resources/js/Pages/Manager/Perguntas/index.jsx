import { usePage } from "@inertiajs/react";

import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";

import { BlockContent } from "@/Components/Manager/BlockContent";
import { Breadcrumb } from "@/Components/Manager/Breadcrumb";
import AdminLayout from "@/Layouts/AdminLayout";
import { PageSettings } from "@/Components/Manager/PageSettings";

const Page = () => {
    const { idioma, idiomas, perguntas, pagina } = usePage().props;

    const breadcrumbItems = [];

    const contentQuestions = {
        nome: ["Perguntas Frequentes", "pergunta"],
        controller: "Perguntas",
        imagens: false,
        imgClass: "",
        editavel: true,
        conteudos: perguntas,
    };

    return (
        <AdminLayout>
            <Breadcrumb
                icon={faCircleQuestion}
                items={breadcrumbItems}
                current="Perguntas Frequentes"
                idioma={idioma.codigo}
                idiomas={idiomas}
            />

             <PageSettings page={pagina} idioma={idioma.codigo} />

            <BlockContent content={contentQuestions} />
        </AdminLayout>
    );
};

export default Page;
