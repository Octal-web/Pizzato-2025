import { useMemo } from 'react';
import { Reveal } from './Reveal';
import { CountryFlag } from './CountryFlag';

const PHONE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="black" style="display:inline-block;vertical-align:-2px;margin-right:4px"><path d="M13.832,16.568a1,1,0,0,0,1.213,-.303l.355,-.465A2,2,0,0,1,16.99,15h3.01a2,2,0,0,1,2,2v3a2,2,0,0,1,-2,2A18,18,0,0,1,2,4a2,2,0,0,1,2,-2h3a2,2,0,0,1,2,2v3.01a2,2,0,0,1,-.8,1.598l-.468,.35a1,1,0,0,0,-.288,1.201a14.9,14.9,0,0,0,6.076,6.421Z"/></svg>`;

function linkifyPhoneNumbers(html) {
  const phoneRegex = /(\+\d{1,3}\s?(?:\(0\))?(?:[\s.-]?\d){6,14})/g;

  const parts = html.split(/(<[^>]+>)/g);

  return parts
    .map((part) => {
      if (part.startsWith('<')) return part;

      return part.replace(phoneRegex, (match) => {
        const telHref = match.replace(/\(0\)/g, '').replace(/[^\d+]/g, '');
        return `<a href="tel:${telHref}" class="inline-flex items-center gap-1">${PHONE_ICON}${match}</a>`;
      });
    })
    .join('');
}

export const ImportsItem = ({ item }) => {
    const descricaoComLinks = useMemo(
        () => (item.descricao ? linkifyPhoneNumbers(item.descricao) : ''),
        [item.descricao]
    );

    return (
        <article className="min-w-0" aria-labelledby={`imports-item-title-${item.id}`}>
            <Reveal className="h-full pt-6">
                <h2
                    id={`imports-item-title-${item.id}`}
                    className="flex items-center gap-3 text-secondary text-2xl lg:text-3xl font-normal leading-tight uppercase"
                >
                    <CountryFlag country={item.pais} />
                    <span>{item.pais}</span>
                </h2>
                {item.descricao && (
                    <div
                        className="font-secondary text-sm lg:text-base text-neutral-700 leading-relaxed mt-4 break-words [&_p+p]:mt-4 [&_a]:underline"
                        dangerouslySetInnerHTML={{ __html: descricaoComLinks }}
                    />
                )}
            </Reveal>
        </article>
    );
};