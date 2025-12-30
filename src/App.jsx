import React, { useState } from 'react';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import GGBApplet from './components/GGBApplet';
import Login from './components/Login';
import './index.css';

const AUTH_KEY = 'ladr_geogebra_auth';
const EXPIRY_DAYS = 30;

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const stored = localStorage.getItem(AUTH_KEY);
        if (!stored) return false;
        try {
            const { expiry } = JSON.parse(stored);
            if (new Date().getTime() > expiry) {
                localStorage.removeItem(AUTH_KEY);
                return false;
            }
            return true;
        } catch (e) {
            localStorage.removeItem(AUTH_KEY);
            return false;
        }
    });

    const [currentMode, setCurrentMode] = useState('graphing');

    const handleLogin = () => {
        const expiry = new Date().getTime() + EXPIRY_DAYS * 24 * 60 * 60 * 1000;
        localStorage.setItem(AUTH_KEY, JSON.stringify({ expiry }));
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem(AUTH_KEY);
        setIsLoggedIn(false);
    };

    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <>
            <TopBar
                currentMode={currentMode}
                onModeChange={setCurrentMode}
                onLogout={handleLogout}
            />
            <main style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
                <GGBApplet mode={currentMode} />
                <Sidebar />
            </main>
        </>
    );
}

export default App;
