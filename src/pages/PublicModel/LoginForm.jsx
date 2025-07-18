import React, { useState } from 'react';
import axios from 'axios';
import config from '../../config';

function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const openMsg = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(''), 3000);
  };

  const doLogin = async () => {
    if (!username.trim()) {
      openMsg('请输入用户名/手机号');
      return;
    }
    if (!password) {
      openMsg('请输入密码');
      return;
    }
    if (showCodeInput && !code.trim()) {
      openMsg('请输入验证码');
      return;
    }

    setLoading(true);
    setMsg('正在为你登录...');

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axios.post(`${config.API_BASE_URL}/api/login`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const data = response.data;
      if (data.status === 200) {
        // Store the entire data object in sessionStorage
        sessionStorage.setItem('loginData', JSON.stringify(data.data));
        console.log(data.data);
        
        setMsg('登录成功，已获取cookies');
        setLoginSuccess(true);
        setLoading(false);
        
        // If onLoginSuccess callback exists, pass the data to parent
        if (onLoginSuccess) {
          onLoginSuccess(data.data);
        }
      } else {
        setLoading(false);
        setMsg(data.desc || '登录失败');
        if (data.status === '1011') {
          setShowCodeInput(true);
        }
      }
    } catch (err) {
      setLoading(false);
      setMsg('登录请求失败，请稍后重试');
      console.error(err);
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 20 }}>
        <input
            type="text"
            placeholder="账号"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading || loginSuccess}
            style={{ flex: '1 1 150px', padding: '6px' }}
        />
        <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || loginSuccess}
            style={{ flex: '1 1 150px', padding: '6px' }}
        />
        {showCodeInput && (
            <input
            type="text"
            placeholder="验证码"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={loading || loginSuccess}
            style={{ flex: '0 0 100px', padding: '6px' }}
            />
        )}
        <button
            onClick={doLogin}
            // disabled={loading || loginSuccess}
            style={{ padding: '6px 16px', whiteSpace: 'nowrap' }}
        >
            {loading ? '正在登录...' : loginSuccess ? '登录成功' : '登录'}
        </button>
        </div>
      {msg && <div style={{ marginTop: 10, color: 'red' }}>{msg}</div>}
    </div>
  );
}

export default LoginForm;
