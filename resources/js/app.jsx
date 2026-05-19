import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import SplashScreen from './Components/SplashScreen';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        const AppWrapper = () => {
            const [isSplashVisible, setIsSplashVisible] = useState(true);
            const [isAnimating, setIsAnimating] = useState(true);

            const isSite = props.initialPage?.props?.isSite || false;

            useEffect(() => {
                setTimeout(() => setIsAnimating(false), 1000); 

                const timer = setTimeout(() => {
                    setIsSplashVisible(false);
                }, 2000);

                return () => clearTimeout(timer);
            }, []);

            return (
                <>
                    {isSplashVisible && (
                        <SplashScreen leaving={!isAnimating} isSite={isSite} />
                    )}
                    <App {...props} />
                </>
            );
        };

        root.render(<AppWrapper />);
    },
    progress: {
        color: '#4B5563',
    },
}).then(() => {
    document.getElementById('app').removeAttribute('data-page');
});