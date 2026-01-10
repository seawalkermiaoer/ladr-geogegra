import React, { useState, useEffect, useRef } from 'react';
import OpenAI from 'openai';
import { SYSTEM_PROMPT } from '../prompts/systemPrompt';
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import axios from 'axios';
import CanvasAnimation from './CanvasAnimation';
import './Sidebar.css';

export default function Sidebar() {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState(localStorage.getItem('dashscope_session_id') || '');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const isGGBCode = (text) => {
        // Simple heuristic: if it contains Chinese or doesn't match common GGB patterns
        if (/[\u4e00-\u9fa5]/.test(text)) return false;
        const ggbPatterns = [/^[a-zA-Z]+\(.*\)/, /^[a-zA-Z_]\w*\s*=/, /^[a-zA-Z_]\w*:/];
        return ggbPatterns.some(pattern => pattern.test(text.trim()));
    };

    const callDashScope = async (prompt) => {
        const apiKey = process.env.DASHSCOPE_API_KEY;
        const appId = process.env.APP_ID;

        if (!apiKey || !appId) {
            return { error: 'API Key or App ID not configured.' };
        }

        const url = `https://dashscope.aliyuncs.com/api/v1/apps/${appId}/completion`;
        const data = {
            input: {
                prompt: prompt,
                session_id: sessionId,
            },
            parameters: {},
            debug: {}
        };

        try {
            const response = await axios.post(url, data, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                const output = response.data.output;
                if (output.session_id) {
                    setSessionId(output.session_id);
                    localStorage.setItem('dashscope_session_id', output.session_id);
                }
                return { text: output.text };
            } else {
                return { error: `API Error: ${response.status} - ${response.data.message || 'Unknown error'}` };
            }
        } catch (error) {
            console.error('DashScope Error:', error);
            return { error: error.response?.data?.message || error.message };
        }
    };


    const callNvidiaAI = async (prompt) => {
        const apiKey = process.env.NVIDIA_API_KEY;

        if (!apiKey) {
            console.warn("NVIDIA_API_KEY not found, falling back or erroring.");
            return { error: 'NVIDIA API Key not configured.' };
        }

        const openai = new OpenAI({
            apiKey: apiKey,
            baseURL: 'https://integrate.api.nvidia.com/v1',
            dangerouslyAllowBrowser: true
        });

        try {
            const completion = await openai.chat.completions.create({
                model: "minimaxai/minimax-m2",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: prompt }
                ],
                temperature: 1,
                top_p: 0.95,
                max_tokens: 8192,
                stream: true
            });

            let fullText = '';
            for await (const chunk of completion) {
                fullText += chunk.choices[0]?.delta?.content || '';
            }

            return { text: fullText };

        } catch (error) {
            console.error('Nvidia AI Error:', error);
            return { error: error.message };
        }
    };

    const handleSend = async () => {
        if (!inputValue.trim() || isLoading) return;

        const currentInput = inputValue.trim();
        setInputValue('');

        // If it looks like direct GeoGebra code, execute it immediately
        if (isGGBCode(currentInput)) {
            executeGGB(currentInput);
            setMessages(prev => [...prev, { role: 'user', content: currentInput, type: 'code' }]);
            return;
        }

        // Otherwise, treat it as an instruction for the AI
        setIsLoading(true);
        setMessages(prev => [...prev, { role: 'user', content: currentInput, type: 'instruction' }]);

        // const result = await callDashScope(currentInput);
        const result = await callNvidiaAI(currentInput);
        setIsLoading(false);

        if (result.error) {
            setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${result.error}`, isError: true }]);
        } else {
            let extractedCode = null;
            let displayText = result.text;

            // Try to parse as JSON first (User specified format)
            try {
                // Handle case where JSON might be wrapped in markdown or just raw
                const cleanText = result.text.replace(/```json\s*|\s*```/g, '').trim();
                const jsonMatch = cleanText.match(/\{[\s\S]*\}/);

                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    if (parsed.code) {
                        extractedCode = parsed.code;
                        displayText = "AI 生成脚本：\n```geogebra\n" + parsed.code + "\n```";
                    }
                }
            } catch (e) {
                // Ignore JSON parse errors, fall back to loose extraction
            }

            // Fallback to standard Regex extraction if JSON parsing didn't yield code
            if (!extractedCode) {
                const codeMatch = result.text.match(/```(?:geogebra|javascript|ggb)?\n([\s\S]*?)```/) ||
                    result.text.match(/`([\s\S]*?)`/);
                extractedCode = codeMatch ? codeMatch[1] : extractGGBCommands(result.text);
            }

            setMessages(prev => [...prev, { role: 'assistant', content: displayText }]);

            if (extractedCode) {
                console.log("Executing extracted GGB commands...");
                executeGGB(extractedCode, true);
            }
        }
    };

    const extractGGBCommands = (text) => {
        // Fallback: try to find lines that look like GGB commands if no code block is found
        const lines = text.split('\n');
        const commands = lines.filter(line => {
            const trimmed = line.trim();
            return /^[a-zA-Z]+\(.*\)/.test(trimmed) || /^[a-zA-Z_]\w*\s*=/.test(trimmed);
        });
        return commands.join('\n');
    };

    const executeGGB = (code, clearFirst = false) => {
        if (!window.ggbApplet) {
            console.warn("GeoGebra applet not ready");
            return;
        }

        try {
            window.ggbApplet.setErrorDialogsActive(false);
            if (clearFirst) {
                // Clear everything for a fresh start (overwrite)
                window.ggbApplet.newConstruction();
            }

            const lines = code.split('\n');
            lines.forEach(line => {
                // Remove comments and replace symbols if necessary
                let cmd = line.split('//')[0].split('#')[0].trim();
                // Replace unicode Pi with 'Pi' for compatibility if needed
                cmd = cmd.replace(/π/g, 'Pi');

                if (cmd) {
                    console.log("Executing GGB:", cmd);
                    window.ggbApplet.evalCommand(cmd);
                }
            });
        } catch (e) {
            console.error("GGB Execution Error:", e);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
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
                {messages.length > 0 && (
                    <button
                        className="clear-chat-btn"
                        onClick={() => {
                            setMessages([]);
                            setSessionId('');
                            localStorage.removeItem('dashscope_session_id');
                        }}
                        title="清空对话"
                    >
                        清除
                    </button>
                )}
            </div>

            <div className="ai-messages">
                {messages.length === 0 ? (
                    <div className="welcome-card">
                        <CanvasAnimation />
                        <h3>Math AI</h3>
                        <p>轻松完成您所需要的动态函数曲线、空间几何、CAS、概率、3D计算。</p>
                        <div className="sample-prompts">
                            <div className="prompt-item" onClick={() => setInputValue("f(x) = x^2 + 3x + 1")}>1. 一元二次函数曲线</div>
                            <div className="prompt-item" onClick={() => setInputValue("g(x) = sin(x)")}>2. 三角函数</div>
                            <div className="prompt-item" onClick={() => setInputValue("画一个红色的正三角形")}>3. 指令：画一个红色的正三角形</div>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div key={idx} className={`message-bubble ${msg.role}`}>
                            <div className="message-icon">
                                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                            </div>
                            <div className="message-content">
                                {msg.content}
                            </div>
                        </div>
                    ))
                )}
                {isLoading && (
                    <div className="message-bubble assistant loading">
                        <div className="message-icon">
                            <Bot size={14} />
                        </div>
                        <div className="message-content">
                            <Loader2 size={16} className="spinner" />
                            <span>正在生成数学模型...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
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
