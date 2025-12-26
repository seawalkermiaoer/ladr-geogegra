import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import CanvasAnimation from './CanvasAnimation';
import './Sidebar.css';

export default function Sidebar() {
    const [inputValue, setInputValue] = useState('');

    const handleSend = () => {
        if (!inputValue.trim()) return;

        // Send to GeoGebra
        const script = inputValue;
        if (window.ggbApplet) {
            const processedScript = script.replace(/#/g, '//');

            try {
                const lines = processedScript.split('\n');
                lines.forEach(line => {
                    const cmd = line.trim();
                    if (cmd) {
                        console.log("Executing GGB command:", cmd);
                        window.ggbApplet.evalCommand(cmd);
                    }
                });
            } catch (e) {
                console.error("GGB Script Error:", e);
            }
        }

        setInputValue('');
    };

    const handleKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <aside className="ai-sidebar">
            <div className="ai-header">
                <div className="ai-icon">
                    <Sparkles size={18} color="#a777e3" />
                    <span>Math AI</span>
                </div>
            </div>

            <div className="ai-messages">
                <div className="welcome-card">
                    <CanvasAnimation />
                    <h3>Math AI</h3>
                    <p>轻松完成您所需要的动态函数曲线、空间几何、CAS、概率、3D计算。</p>
                    <div className="sample-prompts">
                        <div className="prompt-item" onClick={() => setInputValue("f(x) = x^2 + 3x + 1")}>1. 一元二次函数曲线</div>
                        <div className="prompt-item" onClick={() => setInputValue("g(x) = sin(x)")}>2. 三角函数</div>
                        <div className="prompt-item" onClick={() => setInputValue("A = (0, 0)\nB = (3, 0)\nC = (x(A) + 3/2, y(A) + 3 * sqrt(3) / 2)\nPolygon(A, B, C)")}>3. 构建等边三角形</div>
                    </div>
                </div>
            </div>

            <div className="ai-input-area">
                <div className="input-container">
                    <textarea
                        placeholder="输入GeoGebra..."
                        rows="3"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="input-footer">
                        <span className="brand-tag">Powered by DeepSeek</span>
                        <button className="send-btn" onClick={handleSend}>
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
