import React, { useState } from 'react';
import axios from 'axios';

function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false); // 是否显示验证码输入框
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

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
      // 这里的data要根据接口需要组织，我用FormData模拟serialize()效果
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axios.post('http://localhost:5000/api/login', formData, {
      //const response = await axios.post('http://106.14.212.1:5000/api/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const data = response.data;
      if (data.status === 200) {
        setMsg('登录成功，已获取cookies');
      } else {
        setLoading(false);
        setMsg(data.desc || '登录失败');
        // 根据状态决定是否显示验证码输入框
        if (data.status === '1011') {
          setShowCodeInput(true);
        }
        // 其他状态可以根据你的逻辑继续处理
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
            disabled={loading}
            style={{ flex: '1 1 150px', padding: '6px' }}
        />
        <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            style={{ flex: '1 1 150px', padding: '6px' }}
        />
        {showCodeInput && (
            <input
            type="text"
            placeholder="验证码"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={loading}
            style={{ flex: '0 0 100px', padding: '6px' }}
            />
        )}
        <button
            onClick={doLogin}
            disabled={loading}
            style={{ padding: '6px 16px', whiteSpace: 'nowrap' }}
        >
            {loading ? '正在登录...' : '登录'}
        </button>
        </div>
      {msg && <div style={{ marginTop: 10, color: 'red' }}>{msg}</div>}
    </div>
  );
}

export default LoginForm;
