import React, { useEffect, useRef } from 'react';

const GGBApplet = ({ mode }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current || !window.GGBApplet) return;

        // Map mode to Classic perspectives
        let perspective = "1";
        switch (mode) {
            case 'geometry': perspective = "2"; break;
            case 'cas': perspective = "4"; break;
            case '3d': perspective = "5"; break;
            default: perspective = "1";
        }

        // Params for GeoGebra
        console.log('mode', mode, 'perspective', perspective);
        const params = {
            "appName": "classic",
            "perspective": perspective,
            "width": 800, // Initial, but overridden by setSize
            "height": 600,
            "showToolBar": true,
            "showAlgebraInput": true,
            "showMenuBar": true,
            "enableRightClick": true,
            "enableLabelDrags": true,
            "useBrowserForJS": true,
            "showResetIcon": true,
            "allowScale": true,
            "language": "en",
            "preventFocus": true,
            "appletOnLoad": function (api) {
                window.ggbApplet = api;
                if (containerRef.current) {
                    api.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
                }
            }
        };

        // Clean container before injecting
        containerRef.current.innerHTML = '';

        // Create a specific div for injection
        const elementId = 'ggb-element-' + Math.random().toString(36).substr(2, 9);
        const wrapper = document.createElement('div');
        wrapper.id = elementId;
        containerRef.current.appendChild(wrapper);

        // Initialize and inject
        const applet = new window.GGBApplet(params, true);
        applet.inject(elementId);

    }, [mode]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.ggbApplet && containerRef.current) {
                window.ggbApplet.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                flex: 1,
                background: 'white',
                position: 'relative',
                overflow: 'hidden',
                width: '100%',
                height: '100%'
            }}
        />
    );
};

export default GGBApplet;
