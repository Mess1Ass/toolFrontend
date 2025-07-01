import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // ✅ 引入 Router

const root = ReactDOM.createRoot(document.getElementById('root')); // ✅ React 18 API
root.render(
  <React.StrictMode>
    <BrowserRouter>     {/* ✅ Router 提供 useNavigate 等 hook 的上下文 */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
