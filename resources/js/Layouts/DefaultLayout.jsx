import { Head, Link, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";

import Lenis from "@studio-freight/lenis";

import { CookieModal } from "../Components/CookieModal";
import { LanguageSwitcher } from "../Components/LanguageSwitcher";

import { useLang } from "@/hooks/useLang";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DefaultLayout = ({ children }) => {
    const lang = useLang();

    const {
        controller,
        action,
        pagina,
        perguntas_faq,
        linhas_menu,
        categorias_menu,
        notifyCookie,
        rejectCookie,
        dados_gerais,
    } = usePage().props;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [trackingEnabled, setTrackingEnabled] = useState(false);
    const lenisRef = useRef(null);

    const hasDarkHeader =
        ["Cases", "Politica", "Politicas", "Perguntas"].includes(controller) ||
        ["produto"].includes(action);

    useEffect(() => {
        lenisRef.current = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: "vertical",
            smooth: true,
            smoothTouch: false,
        });

        let animationFrame;

        function raf(time) {
            lenisRef.current?.raf(time);
            animationFrame = requestAnimationFrame(raf);
        }

        animationFrame = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(animationFrame);
            lenisRef.current?.destroy();
        };
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "";

        return () => {
            document.body.style.overflow = "";
        };
    }, [isMenuOpen]);

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

    const toggleMenu = () => {
        setIsMenuOpen((current) => !current);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const acceptCookies = () => {
        setTrackingEnabled(true);
    };

    const phones = dados_gerais?.telefones?.split("\n").filter(Boolean) || [];

    const formatPhone = (number) => {
        const clean = number.replace(/\D/g, "");
        const withoutDDI = clean.replace(/^55/, "");
        const ddd = withoutDDI.slice(0, 2);
        const phone = withoutDDI.slice(2);

        if (phone.length === 9) {
            return `(${ddd}) ${phone.slice(0, 5)}-${phone.slice(5)}`;
        }

        return `(${ddd}) ${phone.slice(0, 4)}-${phone.slice(4)}`;
    };

    const stripTags = (value = "") => {
        return String(value)
            .replace(/<[^>]*>/g, " ")
            .replace(/\s+/g, " ")
            .trim();
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
    const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
    const siteName = dados_gerais?.nome || "Pizzato Vinhas e Vinhos";
    const pageTitle = pagina?.titulo || siteName;
    const pageDescription = pagina?.descricao || "";
    const sharingTitle = pagina?.tituloCompartilhamento || pageTitle;
    const sharingDescription =
        pagina?.descricaoCompartilhamento || pageDescription;
    const pageImage = getAbsoluteUrl(pagina?.imagem?.endereco);
    const logoUrl = getAbsoluteUrl("/site/img/logo.png");

    const faqItems = (Array.isArray(perguntas_faq) ? perguntas_faq : [])
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
                <meta property="og:description" content={sharingDescription} />

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
                <meta name="twitter:description" content={sharingDescription} />

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

                <link rel="icon" href="/favicon.ico" type="image/x-icon" />
            </Head>

            <header
                className={`header absolute left-0 right-0 top-0 z-[99] text-white${hasDarkHeader ? " bg-white" : ""}`}
            >
                <div className="container max-w-large">
                    <div className="flex items-center justify-between">
                        <div className="my-8 grid w-full grid-cols-3 items-center xl:my-10 2xl:my-16">
                            <button
                                type="button"
                                className="menu-link"
                                onClick={toggleMenu}
                                aria-label={
                                    isMenuOpen
                                        ? "Fechar menu principal"
                                        : "Abrir menu principal"
                                }
                                aria-expanded={isMenuOpen}
                                aria-controls="menu-principal"
                            >
                                <div
                                    className="flex items-center"
                                    aria-hidden="true"
                                >
                                    <div
                                        className={`w-10 sm:w-12${hasDarkHeader ? " invert" : ""}`}
                                    >
                                        <div className="menu-bar h-[3px] w-8 bg-white transition-all duration-300 ease-in-out sm:w-9" />
                                        <div className="menu-bar mt-1.5 h-[3px] w-8 bg-white transition-all duration-300 ease-in-out sm:mt-2 sm:w-9" />
                                        <div className="menu-bar mt-1.5 h-[3px] w-8 bg-white transition-all duration-300 ease-in-out sm:mt-2 sm:w-9" />
                                    </div>
                                </div>
                            </button>

                            <div className="flex items-center">
                                <Link
                                    href={route("Home.index")}
                                    className="mx-auto flex items-center"
                                    aria-label="Ir para a página inicial da Pizzato Vinhas e Vinhos"
                                >
                                    <img
                                        src="/site/img/logo.png"
                                        alt="Pizzato Vinhas e Vinhos"
                                        width="176"
                                        height="56"
                                        className={`block h-auto w-44 2xl:w-auto${hasDarkHeader ? " invert" : ""}`}
                                    />
                                </Link>
                            </div>

                            <LanguageSwitcher isReverse={hasDarkHeader} />
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    className={`fixed inset-0 z-[3] h-full w-full bg-black transition-opacity duration-500${isMenuOpen ? " pointer-events-auto opacity-50" : " pointer-events-none opacity-0"}`}
                    onClick={closeMenu}
                    aria-label="Fechar menu principal"
                    aria-hidden={!isMenuOpen}
                    tabIndex={isMenuOpen ? 0 : -1}
                />

                <div
                    id="menu-principal"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Menu principal"
                    aria-hidden={!isMenuOpen}
                    inert={!isMenuOpen ? true : undefined}
                    className={`menu-panel fixed left-0 top-0 z-[4] flex h-dvh min-w-[50%] overflow-y-auto overscroll-contain bg-black pl-[5%] pr-10 transition-transform duration-500 2xl:pl-[10%]${isMenuOpen ? "" : " -translate-x-[101%]"}`}
                >
                    <div className="menu-primary-column relative flex min-h-full w-full flex-col justify-end sm:w-3/5">
                        <div className="ml-auto w-full max-w-[25.5rem]">
                            <button
                                type="button"
                                className="menu-close-button absolute top-6 mx-auto ml-2 mt-2 text-xs md:top-10 2xl:top-16"
                                onClick={closeMenu}
                                aria-label="Fechar menu principal"
                            >
                                <span
                                    className="relative inline-block h-4 w-4 2xl:-mb-1"
                                    aria-hidden="true"
                                >
                                    <span className="absolute left-1/2 top-1/2 block h-[3px] w-8 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white sm:w-9 xl:w-7 2xl:w-9" />
                                    <span className="absolute left-1/2 top-1/2 block h-[3px] w-8 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-white sm:w-9 xl:w-7 2xl:w-9" />
                                </span>
                            </button>

                            <nav
                                className="max-sm:mb-14"
                                aria-label="Navegação principal"
                            >
                                <ul className="relative flex flex-col justify-center sm:after:absolute sm:after:-bottom-6 sm:after:-top-6 sm:after:right-0 sm:after:w-px sm:after:bg-neutral-600">
                                    <li className="menu-primary-item relative">
                                        <Link
                                            href={route("Home.index")}
                                            className="menu-primary-link relative text-2xl font-light text-white transition-all hover:font-bold hover:text-secondary 2xl:text-3xl"
                                            onClick={closeMenu}
                                        >
                                            {lang("home")}
                                        </Link>
                                    </li>

                                    <li className="menu-primary-item relative mt-3 2xl:mt-5">
                                        <Link
                                            href={route("Institucional.index")}
                                            className="menu-primary-link relative text-2xl font-light text-white transition-all hover:font-bold hover:text-secondary 2xl:text-3xl"
                                            onClick={closeMenu}
                                        >
                                            {lang("sobre")}
                                        </Link>
                                    </li>

                                    <li className="menu-primary-item relative mt-3 2xl:mt-5">
                                        <Link
                                            href={route("Linhas.linha", {
                                                slug: linhas_menu?.[0]?.slug,
                                            })}
                                            className="menu-primary-link relative text-2xl font-light text-white transition-all hover:font-bold hover:text-secondary 2xl:text-3xl"
                                            onClick={closeMenu}
                                        >
                                            {lang("nossosVinhos")}
                                        </Link>
                                    </li>

                                    <li className="menu-primary-item relative mt-3 2xl:mt-5">
                                        <Link
                                            href={route("Enoturismo.index")}
                                            className="menu-primary-link relative text-2xl font-light text-white transition-all hover:font-bold hover:text-secondary 2xl:text-3xl"
                                            onClick={closeMenu}
                                        >
                                            {lang("enoturismo")}
                                        </Link>
                                    </li>

                                    <li className="menu-primary-item relative mt-3 2xl:mt-5">
                                        <Link
                                            href={route("Contato.index")}
                                            className="menu-primary-link relative text-2xl font-light text-white transition-all hover:font-bold hover:text-secondary 2xl:text-3xl"
                                            onClick={closeMenu}
                                        >
                                            {lang("contato")}
                                        </Link>
                                    </li>

                                    <li className="menu-primary-item relative mt-3 2xl:mt-5">
                                        <a
                                            href={`${dados_gerais?.link_loja}/blog`}
                                            className="menu-primary-link relative text-2xl font-light text-white transition-all hover:font-bold hover:text-secondary 2xl:text-3xl"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {lang("blog")}
                                        </a>
                                    </li>

                                    <li className="menu-primary-item relative mt-3 2xl:mt-5">
                                        <a
                                            href={dados_gerais?.link_loja}
                                            className="menu-primary-link relative text-2xl text-secondary transition-all font-bold hover:font-black hover:opacity-80 2xl:text-3xl"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {lang("lojaVirtual")}
                                        </a>
                                    </li>

                                    <li className="menu-primary-item relative mt-3 2xl:mt-5">
                                        <Link
                                            href={route("Perguntas.index")}
                                            className="menu-primary-link relative text-2xl font-light text-white transition-all hover:font-bold hover:text-secondary 2xl:text-3xl"
                                            onClick={closeMenu}
                                        >
                                            {lang("perguntasFrequentes")}
                                        </Link>
                                    </li>
                                </ul>
                            </nav>

                            <div className="menu-contact-block mt-8 flex w-full flex-col gap-3 text-white 2xl:mt-12 2xl:gap-4">
                                <div>
                                    <a
                                        href="https://api.whatsapp.com/send?text=Ol%C3%A1%21%20Passei%20pelo%20seu%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%21&phone=5554996497010"
                                        className="font-secondary flex h-10 w-56 items-center justify-center gap-3 bg-primary text-center uppercase transition-all hover:bg-opacity-75 2xl:h-12 2xl:w-64"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`${lang("whatsapp")} - abre em nova aba`}
                                    >
                                        <img
                                            src="/site/img/whatsapp.png"
                                            alt=""
                                            width="24"
                                            height="24"
                                            className="h-auto w-6"
                                            aria-hidden="true"
                                        />
                                        {lang("whatsapp")}
                                    </a>
                                </div>

                                <div>
                                    <a
                                        href={dados_gerais?.link_mapa}
                                        className="font-secondary flex h-10 w-56 items-center justify-center bg-primary text-center uppercase tracking-wide transition-all hover:bg-opacity-75 2xl:h-12 2xl:w-64"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`${lang("verMapa")} - abre em nova aba`}
                                    >
                                        {lang("verMapa")}
                                    </a>
                                </div>

                                <p className="menu-address font-secondary max-w-[220px] text-xs text-white opacity-60 lg:max-w-[360px] 2xl:text-sm">
                                    {dados_gerais?.endereco} |{" "}
                                    {lang("endereco4")} {dados_gerais?.cep}
                                </p>

                                <div className="menu-social-block mt-5 flex items-center gap-4 pb-8 xl:mt-2 2xl:mt-10 2xl:pb-20">
                                    <p className="font-secondary text-center text-xs opacity-35">
                                        {lang("nossasRedes")}:
                                    </p>

                                    <ul className="flex gap-5">
                                        <li>
                                            <a
                                                href={dados_gerais?.instagram}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="Instagram - abre em nova aba"
                                            >
                                                <img
                                                    src="/site/img/instagram.png"
                                                    alt=""
                                                    width="24"
                                                    height="24"
                                                    className="h-auto w-6"
                                                    aria-hidden="true"
                                                />
                                            </a>
                                        </li>

                                        <li>
                                            <a
                                                href={dados_gerais?.facebook}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="Facebook - abre em nova aba"
                                            >
                                                <img
                                                    src="/site/img/facebook.png"
                                                    alt=""
                                                    width="24"
                                                    height="24"
                                                    className="h-auto w-6"
                                                    aria-hidden="true"
                                                />
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="menu-secondary-column mb-[20%] hidden w-2/5 flex-col items-center justify-end space-y-2 sm:flex 2xl:mb-[27%]">
                        <div>
                            <h2 className="menu-secondary-title mb-3 text-xl font-bold uppercase text-white 2xl:mb-5 2xl:text-2xl">
                                {lang("marcas")}
                            </h2>

                            <nav aria-label="Marcas">
                                <ul className="menu-secondary-list space-y-1 2xl:space-y-3">
                                    {(linhas_menu || []).map((linha) => (
                                        <li key={linha.id || linha.slug}>
                                            <Link
                                                href={route("Linhas.linha", {
                                                    slug: linha.slug,
                                                })}
                                                className="menu-secondary-link font-secondary text-sm uppercase tracking-wide text-white transition-all hover:opacity-80"
                                                onClick={closeMenu}
                                            >
                                                {linha.nome}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>

                            <h2 className="menu-secondary-title menu-secondary-title-spaced mb-3 mt-10 text-xl font-bold uppercase text-white 2xl:mb-5 2xl:text-2xl">
                                {lang("categorias")}
                            </h2>

                            <nav aria-label="Categorias">
                                <ul className="menu-secondary-list space-y-1 2xl:space-y-3">
                                    {(categorias_menu || []).map(
                                        (categoria) => (
                                            <li key={categoria.id}>
                                                <Link
                                                    href={route(
                                                        "Produtos.index",
                                                        {
                                                            categoria:
                                                                categoria.id,
                                                        },
                                                    )}
                                                    className="menu-secondary-link font-secondary text-sm uppercase tracking-wide text-white transition-all hover:opacity-80"
                                                    onClick={closeMenu}
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
            </header>

            <main
                className={`overflow-hidden${hasDarkHeader ? " min-h-[calc(100dvh_-_350px)] pt-[85px] md:pt-[110px] min-[1441px]:pt-[160px]" : ""}`}
            >
                {children}
            </main>

            <footer className="bg-black pt-16 font-secondary lg:pt-20">
                <div className="container max-w-large">
                    <div className="flex items-start justify-between gap-10 max-md:flex-col">
                        <img
                            src="/site/img/logo.png"
                            alt="Pizzato Vinhas e Vinhos"
                            width="176"
                            height="56"
                            className="block h-auto w-44 max-md:mx-auto 2xl:w-auto"
                        />

                        <div className="w-full md:w-7/12">
                            <nav
                                className="relative mb-7 w-full pb-3 before:absolute before:-left-2 before:-right-2 before:bottom-0 before:border-b before:opacity-50 before:content-['']"
                                aria-label="Navegação do rodapé"
                            >
                                <ul className="flex justify-around gap-x-2 gap-y-3 max-lg:flex-wrap sm:gap-x-10 md:justify-between md:gap-2 lg:gap-6 2xl:gap-10">
                                    <li>
                                        <Link
                                            href={route("Home.index")}
                                            className="text-sm font-medium uppercase text-white opacity-100 transition-all hover:opacity-70"
                                        >
                                            {lang("home")}
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            href={route("Institucional.index")}
                                            className="text-sm font-medium uppercase text-white opacity-100 transition-all hover:opacity-70"
                                        >
                                            {lang("sobre")}
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            href={route(
                                                "Institucional.sustentabilidade",
                                            )}
                                            className="text-sm font-medium uppercase text-white opacity-100 transition-all hover:opacity-70"
                                        >
                                            {lang("sustentabilidade")}
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            href={route("Produtos.index")}
                                            className="text-sm font-medium uppercase text-white opacity-100 transition-all hover:opacity-70"
                                        >
                                            {lang("vinhos")}
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            href={route("Enoturismo.index")}
                                            className="text-sm font-medium uppercase text-white opacity-100 transition-all hover:opacity-70"
                                        >
                                            {lang("enoturismo")}
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            href={route("Contato.index")}
                                            className="text-sm font-medium uppercase text-white opacity-100 transition-all hover:opacity-70"
                                        >
                                            {lang("contato")}
                                        </Link>
                                    </li>

                                    <li>
                                        <a
                                            href={dados_gerais?.link_loja}
                                            className="text-sm font-medium uppercase text-white opacity-100 transition-all hover:opacity-70"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`${lang("lojaVirtual")} - abre em nova aba`}
                                        >
                                            {lang("lojaVirtual")}
                                        </a>
                                    </li>
                                </ul>
                            </nav>

                            <div className="w-full text-sm text-white md:w-auto">
                                <div className="mx-auto flex max-md:flex-wrap">
                                    <div className="max-w-[350px] md:max-w-[200px] lg:max-w-[360px]">
                                        {dados_gerais?.endereco} |{" "}
                                        {lang("endereco4")} {dados_gerais?.cep}
                                        <a
                                            href={dados_gerais?.link_mapa}
                                            className="mt-3 block font-bold uppercase underline opacity-70 transition-all hover:opacity-50"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`${lang("verMapa")} - abre em nova aba`}
                                        >
                                            {lang("verMapa")}
                                        </a>
                                    </div>

                                    <ul className="space-y-2 max-md:mt-6 max-md:w-1/2 md:mx-auto">
                                        {phones.map((phone, index) => {
                                            const isLastPhone =
                                                index === phones.length - 1;

                                            return (
                                                <li key={phone}>
                                                    {isLastPhone ? (
                                                        <a
                                                            href={`https://wa.me/${phone.replace(/\D/g, "")}`}
                                                            target="_blank"
                                                            className="text-sm text-white underline opacity-70 transition-all hover:opacity-100"
                                                        >
                                                            {formatPhone(phone)} <FontAwesomeIcon icon={faWhatsapp}/>
                                                        </a>
                                                    ) : (
                                                        <a
                                                            href={`tel:${phone.replace(/\D/g, "")}`}
                                                            className="text-sm text-white underline opacity-70 transition-all hover:opacity-100"
                                                        >
                                                            {formatPhone(phone)}
                                                        </a>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>

                                    <div className="block max-md:mt-6 max-md:w-1/2 md:hidden">
                                        <ul className="mb-6 ml-auto mt-2 flex justify-end gap-4">
                                            <li>
                                                <a
                                                    href={
                                                        dados_gerais?.instagram
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="opacity-70 transition-all hover:opacity-100"
                                                    aria-label="Instagram - abre em nova aba"
                                                >
                                                    <img
                                                        src="/site/img/instagram.png"
                                                        alt=""
                                                        width="24"
                                                        height="24"
                                                        className="h-auto w-6"
                                                        aria-hidden="true"
                                                    />
                                                </a>
                                            </li>

                                            <li>
                                                <a
                                                    href={
                                                        dados_gerais?.facebook
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="opacity-70 transition-all hover:opacity-100"
                                                    aria-label="Facebook - abre em nova aba"
                                                >
                                                    <img
                                                        src="/site/img/facebook.png"
                                                        alt=""
                                                        width="24"
                                                        height="24"
                                                        className="h-auto w-6"
                                                        aria-hidden="true"
                                                    />
                                                </a>
                                            </li>
                                        </ul>

                                        <Link
                                            href={route("Perguntas.index")}
                                            className="mb-5 block text-right text-xs text-white opacity-50 transition-all hover:opacity-100"
                                        >
                                            {lang("perguntasFrequentes")}
                                        </Link>

                                        <Link
                                            href={route(
                                                "Politicas.privacidade",
                                            )}
                                            className="mb-5 block text-right text-xs text-white opacity-50 transition-all hover:opacity-100"
                                        >
                                            {lang("politicaPrivacidade")}
                                        </Link>

                                        <a
                                            href="https://pedidos.pizzato.net:8081/pedidos4/login.asp"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mb-5 block text-right text-xs text-white opacity-50 transition-all hover:opacity-100"
                                        >
                                            {lang("areaRestrita")}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:block">
                            <ul className="mb-6 ml-auto mt-2 flex justify-end gap-4">
                                <li>
                                    <a
                                        href={dados_gerais?.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="opacity-70 transition-all hover:opacity-100"
                                        aria-label="Instagram - abre em nova aba"
                                    >
                                        <img
                                            src="/site/img/instagram.png"
                                            alt=""
                                            width="24"
                                            height="24"
                                            className="h-auto w-6"
                                            aria-hidden="true"
                                        />
                                    </a>
                                </li>

                                <li>
                                    <a
                                        href={dados_gerais?.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="opacity-70 transition-all hover:opacity-100"
                                        aria-label="Facebook - abre em nova aba"
                                    >
                                        <img
                                            src="/site/img/facebook.png"
                                            alt=""
                                            width="24"
                                            height="24"
                                            className="h-auto w-6"
                                            aria-hidden="true"
                                        />
                                    </a>
                                </li>
                            </ul>

                            <Link
                                href={route("Perguntas.index")}
                                className="mb-2 block text-right text-xs text-white opacity-50 transition-all hover:opacity-100"
                            >
                                {lang("perguntasFrequentes")}
                            </Link>

                            <Link
                                href={route("Politicas.privacidade")}
                                className="mb-2 block text-right text-xs text-white opacity-50 transition-all hover:opacity-100"
                            >
                                {lang("politicaPrivacidade")}
                            </Link>

                            <a
                                href="https://pedidos.pizzato.net:8081/pedidos4/login.asp"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mb-5 block text-right text-xs text-white opacity-50 transition-all hover:opacity-100"
                            >
                                {lang("areaRestrita")}
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-6 bg-neutral-900 md:mt-16">
                    <div className="container max-w-large">
                        <div className="flex h-24 flex-col items-center justify-between py-4 md:h-16 md:flex-row md:py-0 2xl:h-20">
                            <span className="mb-5 text-xs text-white opacity-70 sm:text-sm md:mb-0">
                                PIZZATO Vinhas e Vinhos -{" "}
                                {lang("todosOsDireitosReservados")} ©{" "}
                                {new Date().getFullYear()}.
                            </span>

                            <div className="flex items-center gap-4">
                                <span className="text-xs text-white opacity-70 sm:text-sm">
                                    {lang("desenvolvidoPor")}:
                                </span>

                                <img
                                    src="/site/img/8poroito-logo.png"
                                    alt="8poroito Comunicação e Marketing"
                                    width="112"
                                    height="23"
                                    className="h-auto w-28 opacity-50"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {!notifyCookie || !rejectCookie ? (
                <CookieModal
                    acceptCookies={acceptCookies}
                    visible={!notifyCookie}
                />
            ) : null}
        </>
    );
};

export default DefaultLayout;
