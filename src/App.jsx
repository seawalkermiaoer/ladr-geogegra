import React, { useState } from 'react';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import GGBApplet from './components/GGBApplet';
import Login from './components/Login';
import './index.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentMode, setCurrentMode] = useState('graphing');

    if (!isLoggedIn) {
        return <Login onLogin={() => setIsLoggedIn(true)} />;
    }

    return (
        <>
            <TopBar
                currentMode={currentMode}
                onModeChange={setCurrentMode}
                onLogout={() => setIsLoggedIn(false)}
            />
            <main style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
                <GGBApplet mode={currentMode} />
                <Sidebar />
            </main>
        </>
    );
}

export default App;
