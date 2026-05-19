import { Reveal } from './Reveal';

export const AboutSustainAux = ({ content }) => {
    return (
        <section className="relative py-20 md:py-24 2xl:py-36 mt-16 md:mt-24">
            <div className="absolute inset-0">
                <video src="/site/video/sustain-bg.mp4" autoPlay muted loop className="w-full h-full object-cover" />

                <div className="absolute inset-0 bg-black/60" />
            </div>
            <div className="relative container max-w-large">
                <Reveal className="" direction="top">
                    <h3 className="text-3xl md:text-4xl 2xl:text-5xl text-secondary mb-10 md:mb-14 text-center">{content.titulo}</h3>
                    <div className="font-secondary text-white text-justify md:text-center max-w-2xl mx-auto max-md:tracking-tight" dangerouslySetInnerHTML={{ __html: content.texto }} />
                </Reveal>
            </div>
        </section>
    );
};