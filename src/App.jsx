import React, { useState } from 'react';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import GGBApplet from './components/GGBApplet';
import './index.css';

function App() {
    const [currentMode, setCurrentMode] = useState('graphing');

    return (
        <>
            <TopBar currentMode={currentMode} onModeChange={setCurrentMode} />
            <main style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
                <GGBApplet mode={currentMode} />
                <Sidebar />
            </main>
        </>
    );
}

export default App;
