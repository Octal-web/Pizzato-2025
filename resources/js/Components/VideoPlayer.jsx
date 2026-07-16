import React, { useEffect, useRef, useState } from 'react';

export const VideoPlayer = ({ src, classList = [], autoplay }) => {
    const videoRef = useRef(null);
    const className = classList.join(' ');
    const [videoError, setVideoError] = useState(false);
    const [isPlaying, setIsPlaying] = useState(autoplay);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleUserInteraction = () => {
        if (videoRef.current) {
            videoRef.current.muted = false;
        }
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
    };

    useEffect(() => {
        const videoElement = videoRef.current;

        if (videoElement) {
            const handlePlay = () => setIsPlaying(true);
            const handlePause = () => setIsPlaying(false);

            videoElement.addEventListener('play', handlePlay);
            videoElement.addEventListener('pause', handlePause);

            return () => {
                videoElement.removeEventListener('play', handlePlay);
                videoElement.removeEventListener('pause', handlePause);
            };
        }
    }, []);

    useEffect(() => {
        if (autoplay) {
            document.addEventListener('click', handleUserInteraction);
            document.addEventListener('touchstart', handleUserInteraction);
        }

        return () => {
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('touchstart', handleUserInteraction);
        };
    }, [autoplay]);

    return (
        <div className="relative z-[1] w-full aspect-video md:max-w-[1280px] mx-auto">
            <video
                ref={videoRef}
                className={`absolute inset-0 w-full h-full left-1/2 -translate-x-1/2 ${className}`}
                loop
                controls
                playsInline
                disablePictureInPicture
                controlsList="nodownload noplaybackrate"
                autoPlay={autoplay}
                muted={autoplay}
            >
                <source src={src} type="video/mp4" />
            </video>
            {videoError && <p>Failed to load video. Please try again later.</p>}

            <button
                className={`absolute inset-0 m-auto xl:w-40 h-30 w-30 max-w-[20vw] xl:h-40 2xl:w-fit 2xl:h-fit transition-all z-[1] ${isPlaying ? ' opacity-0 hover:opacity-50' : ' opacity-50 hover:opacity-100'}`}
                onClick={togglePlay}
            >
                <img
                    src={`/site/img/${isPlaying ? 'pause-btn' : 'play-btn'}.png`}
                    className="block"
                    alt={isPlaying ? 'Pause' : 'Play'}
                />
            </button>
        </div>
    );
};