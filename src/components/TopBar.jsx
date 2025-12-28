import React from 'react';
import { Download, Calculator, Box, Triangle, FunctionSquare, LogOut } from 'lucide-react';
import './TopBar.css';

const TABS = [
    { id: 'graphing', label: '绘图', icon: FunctionSquare },
    { id: '3d', label: '3D计算器', icon: Box },
    { id: 'geometry', label: '几何', icon: Triangle },
    { id: 'cas', label: 'CAS', icon: Calculator },
];

export default function TopBar({ currentMode, onModeChange, onLogout }) {
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
                <button className="logout-btn" onClick={onLogout} title="退出登录">
                    <LogOut size={16} />
                    <span>退出</span>
                </button>
            </div>
        </div>
    );
}
