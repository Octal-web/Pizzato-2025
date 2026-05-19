export const PolicyText = ({ content }) => {
    return (
        <>
            <section className="mt-30 mb-12 sm:mb-20">
                <div className="container max-w-small">
                    <h4 className="text-5xl text-center font-bold mb-5">{content.titulo}</h4>
                </div>
            </section>

            <section className="mb-30">
                <div className="container max-w-medium">
                    <div className="font-secondary text-justify" dangerouslySetInnerHTML={{ __html: content.texto }}>
                    </div>
                </div>
            </section>
        </>
    );
};