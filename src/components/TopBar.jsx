import React from 'react';
import { Download, Calculator, Box, Triangle, FunctionSquare } from 'lucide-react';
import './TopBar.css';

const TABS = [
    { id: 'graphing', label: '绘图', icon: FunctionSquare },
    { id: '3d', label: '3D计算器', icon: Box },
    { id: 'geometry', label: '几何', icon: Triangle },
    { id: 'cas', label: 'CAS', icon: Calculator },
];

export default function TopBar({ currentMode, onModeChange }) {
    return (
        <div className="top-bar">
            <div className="logo-section">
                <h1>Ladr-GeoGebra</h1>
            </div>

            <nav className="nav-tabs">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <div
                            key={tab.id}
                            className={`nav-tab ${currentMode === tab.id ? 'active' : ''}`}
                            onClick={() => onModeChange(tab.id)}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </div>
                    );
                })}
            </nav>

            <div className="user-actions">
                <div className="dropdown">

                </div>
            </div>
        </div>
    );
}
