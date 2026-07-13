import { useEffect, useRef } from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const TourismPath = () => {
    const svgRef = useRef(null);
    const ballRef = useRef(null);
    const pathRef = useRef(null);

    useEffect(() => {
        const path = pathRef.current;
        const ball = ballRef.current;
        const svg = svgRef.current;

        const pathLength = path.getTotalLength();
        path.style.strokeDasharray = pathLength;
        path.style.strokeDashoffset = pathLength;

        setTimeout(() => {
            ScrollTrigger.create({
                trigger: svg,
                start: "top 50%",
                end: "bottom 50%",
                scrub: true,
                onUpdate: (self) => {
                    const progress = self.progress;

                    gsap.to(path, {
                        strokeDashoffset: pathLength * (1 - progress),
                        duration: 0.2,
                    });

                    const point = path.getPointAtLength(pathLength * progress);

                    const svgRect = svg.getBoundingClientRect();
                    const containerRect =
                        svg.parentElement.getBoundingClientRect();

                    const matrix = svg.getScreenCTM();
                    const svgPoint = svg.createSVGPoint();
                    svgPoint.x = point.x;
                    svgPoint.y = point.y;
                    const screenPoint = svgPoint.matrixTransform(matrix);

                    const relativeX = screenPoint.x - containerRect.left;
                    const relativeY = screenPoint.y - containerRect.top;

                    gsap.to(ball, {
                        x: relativeX - ball.offsetWidth / 2,
                        y: relativeY - ball.offsetHeight / 2,
                        duration: 0.2,
                    });
                },
            });
        }, 500);

        // return () => {
        //     ScrollTrigger.kill();
        // };
    }, []);

    return (
        <div
            className="absolute left-1/2 w-1/2 h-full -translate-x-1/2 hidden md:block"
            aria-hidden="true"
        >
            <svg
                ref={svgRef}
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                viewBox="0 0 280.8 4037.8"
                className="fill-none stroke-secondary"
            >
                <path
                    ref={pathRef}
                    d="M0.7,0.7c0,0,411.5,374.4,223.7,708.7S40.6,1109.8,108.8,1295s268.2,330.7,52.5,623.4
                        c-329.9,447.8-26,903.5-18.8,921.6c7.2,18.1,305.2,454.3,0,628c-217.4,123.7,46.8,569.3,46.8,569.3"
                    strokeWidth="2"
                />
            </svg>

            <span
                ref={ballRef}
                className="absolute w-7 h-7 top-0 left-0 bg-secondary rounded-[50%] transform translate-x-[350px]"
            />

            {/* <div>
                <Reveal direction="left" reverse={true} className="absolute top-[8%] left-[46%]">
                    <img src={`/content/experiences/details/detail-1.png`} className="max-w-32" />
                </Reveal>

                <Reveal direction="right" reverse={true} className="absolute top-[23%] left-[46%]">
                    <img src={`/content/experiences/details/detail-2.png`} className="max-w-32" />
                </Reveal>

                <Reveal direction="left" reverse={true} className="absolute top-[34%] left-[40%]">
                    <img src={`/content/experiences/details/detail-3.png`} className="max-w-32" />
                </Reveal>

                <Reveal direction="right" reverse={true} className="absolute top-[38.8%] left-[60.6%]">
                    <img src={`/content/experiences/details/detail-4.png`} className="max-w-14" />
                </Reveal>

                <Reveal direction="left" reverse={true} className="absolute top-[55%] left-[29.4%]">
                    <img src={`/content/experiences/details/detail-5.png`} className="max-w-28" />
                </Reveal>

                <Reveal direction="right" reverse={true} className="absolute top-[69%] left-[41%]">
                    <img src={`/content/experiences/details/detail-6.png`} className="max-w-32" />
                </Reveal>

                <Reveal direction="left" reverse={true} className="absolute top-[76%] left-[61%]">
                    <img src={`/content/experiences/details/detail-7.png`} className="max-w-32" />
                </Reveal>

                <Reveal direction="right" reverse={true} className="absolute top-[85%] left-[53%]">
                    <img src={`/content/experiences/details/detail-8.png`} className="max-w-20" />
                </Reveal>

                <Reveal direction="left" reverse={true} className="absolute top-[92%] left-[39%]">
                    <img src={`/content/experiences/details/detail-9.png`} className="max-w-10" />
                </Reveal>
            </div> */}
        </div>
    );
};
