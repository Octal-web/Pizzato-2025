import { useEffect, useRef } from 'react';

export default function FormattedTitle({ text }) {
    const titleRef = useRef(null);

    useEffect(() => {
        const element = titleRef.current;
        if (!element) return;

        const formatText = () => {
            const originalText = text;
            const words = originalText.split(' ');

            const measureSpan = document.createElement('span');
            Object.assign(measureSpan.style, {
                visibility: 'hidden',
                position: 'absolute',
                fontSize: getComputedStyle(element).fontSize,
                fontFamily: getComputedStyle(element).fontFamily,
                fontWeight: getComputedStyle(element).fontWeight,
                whiteSpace: 'nowrap',
            });
            document.body.appendChild(measureSpan);

            const maxWidth = element.offsetWidth;
            let currentLine = '';
            const lines = [];

            words.forEach((word, i) => {
                const testLine = currentLine ? `${currentLine} ${word}` : word;
                measureSpan.textContent = testLine;

                if (measureSpan.offsetWidth > maxWidth && currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }

                if (i === words.length - 1) {
                    lines.push(currentLine);
                }
            });

            document.body.removeChild(measureSpan);

            element.innerHTML = '';
            lines.forEach((line, index) => {
                const lineDiv = document.createElement('div');
                lineDiv.textContent = line;
                lineDiv.className =
                    index === 0 ? 'font-light block' : 'font-bold block';
                element.appendChild(lineDiv);
            });
        };

        document.fonts.ready.then(formatText);
    }, [text]);

    return (
        <h1
            ref={titleRef}
            className="relative text-[44px] sm:text-5xl 2xl:text-6xl font-light text-white leading-[1.1] mb-14 before:content-[''] before:absolute before:-bottom-8 before:w-1/2 before:max-w-28 before:h-[3px] before:bg-secondary"
        >
            {text}
        </h1>
    );
}
