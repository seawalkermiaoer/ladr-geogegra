import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import './Login.css';

export default function Login({ onLogin }) {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Get environment variables or fallback to defaults for local dev
        // __APP_USERNAME__ and __APP_PASSWORD__ are replaced by Vite during build
        const safeUsername = (typeof __APP_USERNAME__ !== 'undefined' && __APP_USERNAME__) ? __APP_USERNAME__ : 'admin';
        const safePassword = (typeof __APP_PASSWORD__ !== 'undefined' && __APP_PASSWORD__) ? __APP_PASSWORD__ : 'password';

        if (username === safeUsername && password === safePassword) {
            onLogin();
        } else {
            alert("账号或密码错误");
        }
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <div className="left-content">
                    <h1>Math AI</h1>
                    <p>这是您的智能数学助手。提供动态函数曲线、空间几何、CAS计算等功能，助您轻松探索数学世界。</p>
                </div>
            </div>
            <div className="login-right">
                <div className="login-card">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>账号</label>
                            <div className="input-wrapper">
                                <User size={18} className="input-icon" />
                                <input
                                    type="text"
                                    placeholder="请输入账号"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>密码</label>
                            <div className="input-wrapper">
                                <Lock size={18} className="input-icon" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="请输入密码"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <button type="submit" className="login-btn">登录</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
