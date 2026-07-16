import React from 'react';

const SplashScreen = ({ leaving, isSite }) => {
    if (!isSite) return;

    return (
        <>
            <div className={`fixed bg-black inset-0 z-[1000] transition-all duration-700 delay-300 ${leaving && ' translate-y-full'}`} />

            <div className={`fixed left-1/2 -translate-x-1/2 z-[1000] transition-all duration-1000 ${leaving ? '-top-40 -translate-y-full' : 'top-1/2 -translate-y-1/2'}`}>
                <img src={`/site/img/logo.png`} alt="Logo" className="block mx-auto max-w-[28vw] w-44 2xl:w-auto" />
            </div>
        </>
    );
};

export default SplashScreen;