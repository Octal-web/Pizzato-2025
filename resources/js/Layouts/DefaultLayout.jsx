import { Head, Link, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";

import Lenis from "@studio-freight/lenis";

import { CookieModal } from "../Components/CookieModal";
import { LanguageSwitcher } from "../Components/LanguageSwitcher";

import { useLang } from "@/hooks/useLang";

const DefaultLayout = ({ children }) => {
    const lang = useLang();

    const {
        controller,
        action,
        pagina,
        perguntas_seo,
        linhas_menu,
        categorias_menu,
        notifyCookie,
        rejectCookie,
        dados_gerais,
    } = usePage().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [trackingEnabled, setTrackingEnabled] = useState(false);
    const lenisRef = useRef(null);

    useEffect(() => {
        lenisRef.current = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: "vertical",
            smooth: true,
            smoothTouch: false,
        });

        function raf(time) {
            lenisRef.current.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenisRef.current.destroy();
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const acceptCookies = () => {
        setTrackingEnabled(true);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (notifyCookie || trackingEnabled) {
                if (
                    !document.querySelector(
                        'script[src*="googletagmanager.com/gtm.js"]',
                    )
                ) {
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({
                        "gtm.start": new Date().getTime(),
                        event: "gtm.js",
                    });

                    const firstScript =
                        document.getElementsByTagName("script")[0];
                    const gtmScript = document.createElement("script");
                    gtmScript.async = true;
                    gtmScript.src =
                        "https://www.googletagmanager.com/gtm.js?id=GTM-5P3H4J8";
                    firstScript.parentNode.insertBefore(gtmScript, firstScript);

                    if (
                        !document.querySelector(
                            'iframe[src*="googletagmanager.com/ns.html"]',
                        )
                    ) {
                        const noscript = document.createElement("noscript");
                        const iframe = document.createElement("iframe");
                        iframe.src =
                            "https://www.googletagmanager.com/ns.html?id=GTM-5P3H4J8";
                        iframe.height = "0";
                        iframe.width = "0";
                        iframe.style.display = "none";
                        iframe.style.visibility = "hidden";
                        noscript.appendChild(iframe);
                        document.body.insertBefore(
                            noscript,
                            document.body.firstChild,
                        );
                    }
                }

                if (
                    !document.querySelector(
                        'script[src*="86ee18b8-ca84-4bfe-b470-7a540f8a1d03-loader.js"]',
                    )
                ) {
                    const cloudScript = document.createElement("script");
                    cloudScript.async = true;
                    cloudScript.src =
                        "https://d335luupugsy2.cloudfront.net/js/loader-scripts/86ee18b8-ca84-4bfe-b470-7a540f8a1d03-loader.js";
                    document.head.appendChild(cloudScript);
                }
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [notifyCookie, trackingEnabled]);

    const phones = dados_gerais?.telefones.split("\n");

    function formatPhone(number) {
        const clean = number.replace(/\D/g, "");

        const withoutDDI = clean.replace(/^55/, "");

        const ddd = withoutDDI.slice(0, 2);
        const phone = withoutDDI.slice(2);

        if (phone.length === 9) {
            return `(${ddd}) ${phone.slice(0, 5)}-${phone.slice(5)}`;
        } else {
            return `(${ddd}) ${phone.slice(0, 4)}-${phone.slice(4)}`;
        }
    }

    const stripTags = (value = "") => {
        return String(value).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    };

    const getAbsoluteUrl = (url) => {
        if (!url) return "";

        if (/^https?:\/\//i.test(url)) return url;

        if (typeof window === "undefined") return url;

        return new URL(url, window.location.origin).href;
    };

    const canonicalUrl =
        typeof window !== "undefined"
            ? `${window.location.origin}${window.location.pathname}`
            : "";

    const siteUrl =
        typeof window !== "undefined" ? window.location.origin : "";

    const siteName = dados_gerais?.nome || "Pizzato Vinhas e Vinhos";
    const pageTitle = pagina?.titulo || siteName;
    const pageDescription = pagina?.descricao || "";
    const sharingTitle = pagina?.tituloCompartilhamento || pageTitle;
    const sharingDescription =
        pagina?.descricaoCompartilhamento || pageDescription;
    const pageImage = getAbsoluteUrl(pagina?.imagem?.endereco);
    const logoUrl = getAbsoluteUrl("/site/img/logo.png");

    const faqItems = (Array.isArray(perguntas_seo) ? perguntas_seo : [])
        .filter((pergunta) => pergunta?.pergunta && pergunta?.resposta)
        .map((pergunta) => ({
            "@type": "Question",
            name: stripTags(pergunta.pergunta),
            acceptedAnswer: {
                "@type": "Answer",
                text: stripTags(pergunta.resposta),
            },
        }));

    const structuredData = [
        canonicalUrl
            ? {
                  "@context": "https://schema.org",
                  "@type": "WebPage",
                  name: pageTitle,
                  description: pageDescription,
                  url: canonicalUrl,
                  inLanguage: "pt-BR",
                  isPartOf: siteUrl
                      ? {
                            "@type": "WebSite",
                            name: siteName,
                            url: siteUrl,
                        }
                      : undefined,
                  publisher: siteUrl
                      ? {
                            "@type": "Organization",
                            name: siteName,
                            url: siteUrl,
                            logo: logoUrl,
                            sameAs: [
                                dados_gerais?.instagram,
                                dados_gerais?.facebook,
                            ].filter(Boolean),
                        }
                      : undefined,
              }
            : null,
        faqItems.length
            ? {
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: faqItems,
              }
            : null,
    ].filter(Boolean);

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta
                    name="robots"
                    content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
                />
                <meta name="author" content="Octal Web" />

                {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content={siteName} />
                <meta property="og:locale" content="pt_BR" />
                <meta property="og:title" content={sharingTitle} />
                <meta
                    property="og:description"
                    content={sharingDescription}
                />
                {pageImage && <meta property="og:image" content={pageImage} />}
                {pageImage && (
                    <meta property="og:image:secure_url" content={pageImage} />
                )}
                {pagina?.imagem?.tipo && (
                    <meta
                        property="og:image:type"
                        content={pagina.imagem.tipo}
                    />
                )}
                {pagina?.imagem?.largura && (
                    <meta
                        property="og:image:width"
                        content={pagina.imagem.largura}
                    />
                )}
                {pagina?.imagem?.altura && (
                    <meta
                        property="og:image:height"
                        content={pagina.imagem.altura}
                    />
                )}
                {pageImage && (
                    <meta property="og:image:alt" content={sharingTitle} />
                )}

                <meta
                    name="twitter:card"
                    content={pageImage ? "summary_large_image" : "summary"}
                />
                <meta name="twitter:title" content={sharingTitle} />
                <meta
                    name="twitter:description"
                    content={sharingDescription}
                />
                {pageImage && <meta name="twitter:image" content={pageImage} />}
                {pageImage && (
                    <meta name="twitter:image:alt" content={sharingTitle} />
                )}

                {structuredData.map((schema, index) => (
                    <script
                        key={index}
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify(schema),
                        }}
                    />
                ))}

                <link rel="icon" href={`/favicon.ico`} type="image/x-icon" />
            </Head>
            <header
                className={`header absolute top-0 left-0 right-0 z-[99] text-white${["Cases", "Politica", "Politicas", "Perguntas"].includes(controller) || ["produto"].includes(action) ? " bg-white" : ""}`}
            >
                <div className="container max-w-large">
                    <div className="flex items-center justify-between">
                        <div className="grid grid-cols-3 items-center w-full my-8 xl:my-10 2xl:my-16">
                            <button className="menu-link" onClick={toggleMenu}>
                                <div className="flex items-center">
                                    <div
                                        className={`w-10 sm:w-12${["Cases", "Politica", "Politicas", "Perguntas"].includes(controller) || ["produto"].includes(action) ? " invert" : ""}`}
                                    >
                                        <div className="menu-bar bg-white h-[3px] w-8 sm:w-9 transition-all ease-in-out duration-300"></div>
                                        <div className="menu-bar bg-white h-[3px] w-8 sm:w-9 transition-all ease-in-out duration-300 mt-1.5 sm:mt-2"></div>
                                        <div className="menu-bar bg-white h-[3px] w-8 sm:w-9 transition-all ease-in-out duration-300 mt-1.5 sm:mt-2"></div>
                                    </div>
                                </div>
                            </button>

                            <h1 className="flex items-center">
                                <Link
                                    href={route("Home.index")}
                                    className="flex items-center mx-auto"
                                >
                                    <img
                                        src={`/site/img/logo.png`}
                                        alt="Logo"
                                        className={`block w-44 2xl:w-auto ${["Cases", "Politica", "Politicas", "Perguntas"].includes(controller) || ["produto"].includes(action) ? " invert" : ""}`}
                                    />
                                </Link>
                            </h1>

                            <LanguageSwitcher
                                isReverse={
                                    ["Cases", "Politicas", "Perguntas"].includes(
                                        controller,
                                    ) || ["produto"].includes(action)
                                }
                            />

                            <div
                                className={`fixed top-0 left-0 z-[3] bg-black w-full h-full transition-opacity duration-500 ${isMenuOpen ? "opacity-50 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                                onClick={() => {
                                    setIsMenuOpen(false);
                                }}
                            />
                            <div
                                className={`${isMenuOpen ? "" : "transform -translate-x-[101%]"} flex fixed top-0 left-0 z-[4] bg-black min-w-[50%] h-full pl-[5%] 2xl:pl-[10%] pr-10 transition-all duration-500`}
                            >
                                <div className="relative w-full sm:w-3/5 flex flex-col justify-end min-h-full">
                                    <div className="ml-auto w-full max-w-[25.5rem]">
                                        <button
                                            className="absolute top-6 md:top-10 2xl:top-16 mt-2 ml-2 mx-auto text-xs"
                                            onClick={toggleMenu}
                                        >
                                            <div className="relative inline-block w-4 h-4 2xl:-mb-1">
                                                <span className="block absolute top-1/2 left-1/2 w-8 sm:w-9 xl:w-7 2xl:w-9 h-[3px] bg-white transform -translate-x-1/2 -translate-y-1/2 rotate-45" />
                                                <span className="block absolute top-1/2 left-1/2 w-8 sm:w-9 xl:w-7 2xl:w-9 h-[3px] bg-white transform -translate-x-1/2 -translate-y-1/2 -rotate-45" />
                                            </div>
                                        </button>
                                        <nav className="max-sm:mb-14">
                                            <ul className="relative flex flex-col justify-center sm:after:absolute sm:after:-top-6 sm:after:-bottom-6 sm:after:w-px sm:after:bg-neutral-600 sm:after:right-0">
                                                <li className="relative">
                                                    <Link
                                                        href={route(
                                                            "Home.index",
                                                        )}
                                                        className="relative text-2xl 2xl:text-3xl text-white font-light transition-all hover:font-bold hover:text-secondary"
                                                    >
                                                        {lang("home")}
                                                    </Link>
                                                </li>
                                                <li className="relative mt-3 2xl:mt-5">
                                                    <Link
                                                        href={route(
                                                            "Institucional.index",
                                                        )}
                                                        className="relative text-2xl 2xl:text-3xl text-white font-light transition-all hover:font-bold hover:text-secondary"
                                                    >
                                                        {lang("sobre")}
                                                    </Link>
                                                </li>
                                                {/* <li className="relative mt-3 2xl:mt-5">
                                                    <Link href={route('Institucional.sustentabilidade')} className="relative text-2xl 2xl:text-3xl text-white font-light transition-all hover:font-bold hover:text-secondary">Sustentabilidade</Link>
                                                </li> */}
                                                <li className="relative mt-3 2xl:mt-5">
                                                    <Link
                                                        href={route(
                                                            "Linhas.linha",
                                                            {
                                                                slug: linhas_menu[0]
                                                                    .slug,
                                                            },
                                                        )}
                                                        className="relative text-2xl 2xl:text-3xl text-white font-light transition-all hover:font-bold hover:text-secondary"
                                                    >
                                                        {lang("nossosVinhos")}
                                                    </Link>
                                                </li>
                                                <li className="relative mt-3 2xl:mt-5">
                                                    <Link
                                                        href={route(
                                                            "Enoturismo.index",
                                                        )}
                                                        className="relative text-2xl 2xl:text-3xl text-white font-light transition-all hover:font-bold hover:text-secondary"
                                                    >
                                                        {lang("enoturismo")}
                                                    </Link>
                                                </li>
                                                <li className="relative mt-3 2xl:mt-5">
                                                    <Link
                                                        href={route(
                                                            "Contato.index",
                                                        )}
                                                        className="relative text-2xl 2xl:text-3xl text-white font-light transition-all hover:font-bold hover:text-secondary"
                                                    >
                                                        {lang("contato")}
                                                    </Link>
                                                </li>
                                                <li className="relative mt-3 2xl:mt-5">
                                                    <a
                                                        href={`${dados_gerais.link_loja}/blog`}
                                                        className="relative text-2xl 2xl:text-3xl text-white font-light transition-all hover:font-bold hover:text-secondary"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {lang("blog")}
                                                    </a>
                                                </li>
                                                <li className="relative mt-3 2xl:mt-5">
                                                    <a
                                                        href={dados_gerais.link_loja}
                                                        className="relative text-2xl 2xl:text-3xl text-white font-light transition-all hover:font-bold hover:text-secondary"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {lang("lojaVirtual")}
                                                    </a>
                                                </li>
                                            </ul>
                                        </nav>
                                        <div className="flex flex-col gap-3 2xl:gap-4 text-white w-full mt-8 2xl:mt-12">
                                            <div>
                                                <a
                                                    href="https://api.whatsapp.com/send?text=Ol%C3%A1%21%20Passei%20pelo%20seu%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%21&phone=555481140116"
                                                    className="font-secondary w-56 2xl:w-64 bg-primary text-center h-10 2xl:h-12 uppercase flex gap-3 justify-center items-center transition-all hover:bg-opacity-75"
                                                    target="_blank"
                                                >
                                                    <img
                                                        src={`/site/img/whatsapp.png`}
                                                    />{" "}
                                                    {lang("whatsapp")}
                                                </a>
                                            </div>
                                            <div>
                                                <a
                                                    href={dados_gerais.link_mapa}
                                                    className="font-secondary w-56 2xl:w-64 bg-primary text-center h-10 2xl:h-12 flex items-center justify-center tracking-wide uppercase transition-all hover:bg-opacity-75"
                                                    target="_blank"
                                                >
                                                    {lang("verMapa")}
                                                </a>
                                            </div>
                                            <p className="font-secondary text-xs 2xl:text-sm text-white opacity-60 max-w-[220px] lg:max-w-[360px]">
                                                {dados_gerais.endereco} |{" "}
                                                {lang("endereco4")} {dados_gerais.cep}
                                            </p>
                                            <div className="flex items-center gap-4 pb-8 2xl:pb-20 mt-5 xl:mt-2 2xl:mt-10">
                                                <h5 className="font-secondary text-xs text-center opacity-35">
                                                    {lang("nossasRedes")}:
                                                </h5>
                                                <ul className="flex gap-5">
                                                    <li>
                                                        <a
                                                            href="https://www.instagram.com/8poroito/"
                                                            target="_blank"
                                                        >
                                                            <img
                                                                src={`/site/img/instagram.png`}
                                                                alt="instagram"
                                                            />
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            href={dados_gerais.facebook}
                                                            target="_blank"
                                                        >
                                                            <img
                                                                src={`/site/img/facebook.png`}
                                                                alt="facebook"
                                                            />
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden sm:flex w-2/5 space-y-2 flex-col mb-[20%] 2xl:mb-[27%] items-center justify-end">
                                    <div>
                                        <h4 className="text-xl 2xl:text-2xl text-white font-bold uppercase mb-3 2xl:mb-5">
                                            {lang("marcas")}
                                        </h4>

                                        <nav>
                                            <ul className="space-y-2 2xl:space-y-3">
                                                {linhas_menu.map(
                                                    (linha, index) => (
                                                        <li key={index}>
                                                            <Link
                                                                href={route(
                                                                    "Linhas.linha",
                                                                    {
                                                                        slug: linha.slug,
                                                                    },
                                                                )}
                                                                className="font-secondary text-sm text-white uppercase tracking-wide transition-all hover:opacity-80"
                                                            >
                                                                {linha.nome}
                                                            </Link>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </nav>

                                        <h4 className="text-xl 2xl:text-2xl text-white font-bold uppercase mt-10 mb-3 2xl:mb-5">
                                            {lang("categorias")}
                                        </h4>

                                        <nav>
                                            <ul className="space-y-2 2xl:space-y-3">
                                                {categorias_menu.map(
                                                    (categoria, index) => (
                                                        <li key={index}>
                                                            <Link
                                                                href={route(
                                                                    "Produtos.index",
                                                                    {
                                                                        categoria:
                                                                            categoria.id,
                                                                    },
                                                                )}
                                                                className="font-secondary text-sm text-white uppercase tracking-wide transition-all hover:opacity-80"
                                                            >
                                                                {categoria.nome}
                                                            </Link>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main
                className={`overflow-hidden${["Cases", "Politicas", "Perguntas"].includes(controller) || ["produto"].includes(action) ? " pt-[85px] md:pt-[110px] min-[1441px]:pt-[160px] min-h-[calc(100dvh_-_350px)]" : ""}`}
            >
                {children}
            </main>

            <footer className="bg-black font-secondary pt-16 lg:pt-20">
                <div className="container max-w-large">
                    <div className="flex max-md:flex-col justify-between items-start gap-10">
                        <img
                            src={`/site/img/logo.png`}
                            alt="Logo"
                            className="max-md:mx-auto block w-44 2xl:w-auto"
                        />

                        <div className="w-full md:w-7/12">
                            <nav className="relative w-full pb-3 mb-7 before:content-[''] before:absolute before:bottom-0 before:-left-2 before:-right-2 before:border-b before:opacity-50">
                                <ul className="flex max-lg:flex-wrap justify-around md:justify-between gap-x-2 sm:gap-x-10 gap-y-3 md:gap-2 lg:gap-6 2xl:gap-10">
                                    <li>
                                        <Link
                                            href={route("Home.index")}
                                            className="text-white text-sm font-medium uppercase transition-all opacity-100 hover:opacity-70"
                                        >
                                            {lang("home")}
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            href={route("Institucional.index")}
                                            className="text-white text-sm font-medium uppercase transition-all opacity-100 hover:opacity-70"
                                        >
                                            {lang("sobre")}
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            href={route(
                                                "Institucional.sustentabilidade",
                                            )}
                                            className="text-white text-sm font-medium uppercase transition-all opacity-100 hover:opacity-70"
                                        >
                                            {lang("sustentabilidade")}
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            href={route("Produtos.index")}
                                            className="text-white text-sm font-medium uppercase transition-all opacity-100 hover:opacity-70"
                                        >
                                            {lang("vinhos")}
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            href={route("Enoturismo.index")}
                                            className="text-white text-sm font-medium uppercase transition-all opacity-100 hover:opacity-70"
                                        >
                                            {lang("enoturismo")}
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            href={route("Contato.index")}
                                            className="text-white text-sm font-medium uppercase transition-all opacity-100 hover:opacity-70"
                                        >
                                            {lang("contato")}
                                        </Link>
                                    </li>

                                    <li>
                                        <a
                                            href={dados_gerais.link_loja}
                                            className="text-white text-sm font-medium uppercase transition-all opacity-100 hover:opacity-70"
                                            target="_blank"
                                        >
                                            {lang("lojaVirtual")}
                                        </a>
                                    </li>
                                </ul>
                            </nav>

                            <div className="w-full md:w-auto text-white text-sm">
                                <div className="flex max-md:flex-wrap mx-auto">
                                    <div className="max-w-[350px] md:max-w-[200px] lg:max-w-[360px]">
                                        {dados_gerais.endereco} |{" "}
                                        {lang("endereco4")} {dados_gerais.cep}
                                        <a
                                            href={dados_gerais.link_mapa}
                                            className="block font-bold underline uppercase opacity-70 transition-all hover:opacity-50 mt-3"
                                            target="_blank"
                                        >
                                            {lang("verMapa")}
                                        </a>
                                    </div>

                                    <ul className="md:mx-auto max-md:mt-6 space-y-2 max-md:w-1/2">
                                        {phones.map((phone, index) => (
                                            <li key={index}>
                                                <a
                                                    href={`tel:${phone}`}
                                                    className="text-white text-sm underline transition-all opacity-70 hover:opacity-100"
                                                >
                                                    {formatPhone(phone)}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="block md:hidden max-md:w-1/2 max-md:mt-6">
                                        <ul className="flex justify-end gap-4 ml-auto mt-2 mb-6">
                                            <li>
                                                <a
                                                    href={
                                                        dados_gerais.instagram
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="transition-all opacity-70 hover:opacity-100"
                                                >
                                                    <img
                                                        className="w-6"
                                                        src={`/site/img/instagram.png`}
                                                        alt="instagram"
                                                    />
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href={dados_gerais.facebook}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="transition-all opacity-70 hover:opacity-100"
                                                >
                                                    <img
                                                        className="w-6"
                                                        src={`/site/img/facebook.png`}
                                                        alt="facebook"
                                                    />
                                                </a>
                                            </li>
                                        </ul>

                                        <Link
                                            href={route(
                                                "Perguntas.index",
                                            )}
                                            className="block mb-5 text-white text-xs transition-all opacity-50 hover:opacity-100 max-md:text-right"
                                        >
                                            {lang("perguntasFrequentes")}
                                        </Link>

                                        <Link
                                            href={route(
                                                "Politicas.privacidade",
                                            )}
                                            className="block mb-5 text-white text-xs transition-all opacity-50 hover:opacity-100 max-md:text-right"
                                        >
                                            {lang("politicaPrivacidade")}
                                        </Link>

                                        <a
                                            href="https://pedidos.pizzato.net:8081/pedidos4/login.asp"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block mb-5 text-white text-xs transition-all opacity-50 hover:opacity-100 max-md:text-right"
                                        >
                                            {lang("areaRestrita")}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:block">
                            <ul className="flex justify-end gap-4 ml-auto mt-2 mb-6">
                                <li>
                                    <a
                                        href={dados_gerais.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="transition-all opacity-70 hover:opacity-100"
                                    >
                                        <img
                                            className="w-6"
                                            src={`/site/img/instagram.png`}
                                            alt="instagram"
                                        />
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href={dados_gerais.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="transition-all opacity-70 hover:opacity-100"
                                    >
                                        <img
                                            className="w-6"
                                            src={`/site/img/facebook.png`}
                                            alt="facebook"
                                        />
                                    </a>
                                </li>
                            </ul>

                            <Link
                                href={route("Perguntas.index")}
                                className="block mb-2 text-white text-xs text-right transition-all opacity-50 hover:opacity-100"
                            >
                                {lang("perguntasFrequentes")}
                            </Link>

                            <Link
                                href={route("Politicas.privacidade")}
                                className="block mb-2 text-white text-xs text-right transition-all opacity-50 hover:opacity-100"
                            >
                                {lang("politicaPrivacidade")}
                            </Link>

                            <a
                                href="https://pedidos.pizzato.net:8081/pedidos4/login.asp"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block mb-5 text-white text-xs text-right transition-all opacity-50 hover:opacity-100 max-md:text-right"
                            >
                                {lang("areaRestrita")}
                            </a>
                        </div>
                    </div>
                </div>

                <div className="bg-neutral-900 mt-6 md:mt-16">
                    <div className="container max-w-large">
                        <div className="flex flex-col md:flex-row justify-between items-center h-24 md:h-16 2xl:h-20 py-4 md:py-0">
                            <span className="text-white text-xs sm:text-sm opacity-70 mb-5 md:mb-0">
                                PIZZATO Vinhas e Vinhos -{" "}
                                {lang("todosOsDireitosReservados")} ©{" "}
                                {new Date().getFullYear()}.
                            </span>

                            <div className="flex items-center gap-4">
                                <span className="text-white text-xs sm:text-sm opacity-70">
                                    {lang("desenvolvidoPor")}:{" "}
                                </span>
                                <img
                                    src={`/site/img/8poroito-logo.png`}
                                    className="opacity-50"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {!notifyCookie || !rejectCookie ? (
                <CookieModal
                    acceptCookies={acceptCookies}
                    visible={notifyCookie ? false : true}
                />
            ) : null}
        </>
    );
};

export default DefaultLayout;