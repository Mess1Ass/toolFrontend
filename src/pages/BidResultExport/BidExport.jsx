import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Steps, Button, Spin } from '@douyinfe/semi-ui';
import LoginForm from '../PublicModel/LoginForm';
import ShopDetail from './ShopDetail';
import config from '../../config';

export default function BidExport() {
  const [shopHtml, setShopHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [shopData, setShopData] = useState(null);
  const [error, setError] = useState('');
  const [loginData, setLoginData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [initLoading, setInitLoading] = useState(true); // 新增：初始加载状态

  useEffect(() => {
    const loginData = JSON.parse(sessionStorage.getItem('loginData'));
    if (loginData) {
      setCurrentStep(1);
      setLoginData(loginData);
      setInitLoading(true);
      // 自动获取第一页商品数据
      fetchShopData(1, loginData, () => setInitLoading(false));
    } else {
      setInitLoading(false);
    }
  }, []);

  // fetchShopData 支持传入 loginData 以便首次加载时复用
  const fetchShopData = async (page = 1, loginDataParam, cb) => {
    
    const loginData = loginDataParam || JSON.parse(sessionStorage.getItem('loginData'));
    if (!loginData) {
      setError('请先登录');
      cb && cb();
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const cookieString = loginData.cookies.map(cookie => `${cookie.name}=${cookie.value}`)
        .join('; ');
      const response = await axios.post(`${config.API_BASE_URL}/api/shop`, {
        totalCount: loginData.totalCount,
        brand_id: loginData.brand_id,
        cookies: cookieString,
        pageNum: page - 1 // 后端从0开始
      });
      if (response.data.status === 200) {
        setShopData(response.data.data);
        setPageNum(page);
      } else {
        setError(response.data.error || '获取数据失败');
      }
    } catch (err) {
      setError('请求失败：' + err.message);
    } finally {
      setLoading(false);
      cb && cb();
    }
  };

  // 登录成功后进入第二步
  const handleLoginSuccess = () => {
    const loginData = JSON.parse(sessionStorage.getItem('loginData'));
    setCurrentStep(1);
    setLoginData(loginData);
    setInitLoading(true);
    fetchShopData(1, loginData, () => setInitLoading(false));
  };

  // 新增：导出竞价数据
  const handleExportData = async (selectedData) => {
    const loginData = JSON.parse(sessionStorage.getItem('loginData'));
    if (!loginData) {
      setError('请先登录');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const cookieString = loginData.cookies
        .map(cookie => `${cookie.name}=${cookie.value}`)
        .join('; ');
      
      let successCount = 0;
      let failCount = 0;
      
      // 循环调用接口，每次传递单个商品数据
      for (let i = 0; i < selectedData.length; i++) {
        const data = selectedData[i];
        // 显示导出进度
        setError(`正在导出第 ${i + 1}/${selectedData.length} 个商品...`);
        
        try {
          const response = await axios.post(`${config.API_BASE_URL}/api/exportGoodsExcel`, {
            data: data, // 改为传递单个data而不是dataList
            cookies: cookieString
          }, {
            responseType: 'blob' // 设置响应类型为blob以处理文件下载
          });
          
          // 检查响应状态
          if (response.status === 200) {
            // 创建下载链接
            const blob = new Blob([response.data], { 
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            
            // 从响应头获取文件名，如果没有则使用默认名称
            const contentDisposition = response.headers['content-disposition'];
            let filename = `${data.title}.xlsx`;
            if (contentDisposition) {
              const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
              if (filenameMatch && filenameMatch[1]) {
                filename = filenameMatch[1].replace(/['"]/g, '');
              }
            }
            
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            successCount++;
          } else {
            failCount++;
            console.error(`第${i + 1}个商品导出失败:`, response.status);
          }
        } catch (err) {
          failCount++;
          console.error(`第${i + 1}个商品导出异常:`, err.message);
        }
      }
      
      setError(''); // 清除进度提示
      
      if (failCount === 0) {
        alert(`导出成功！共导出 ${successCount} 个商品`);
      } else {
        alert(`导出完成！成功 ${successCount} 个，失败 ${failCount} 个`);
      }
    } catch (err) {
      setError('导出失败：' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 分页条渲染
  const pageSize = 20;
  const totalCount = loginData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const maxShow = 10;
    let start = Math.max(1, pageNum - Math.floor(maxShow / 2));
    let end = start + maxShow - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxShow + 1);
    }
    const pages = [];
    for (let i = start; i <= end; i++) {
      if (i === pageNum) {
        pages.push(<span key={i} className="custom-pagination-current">{i}</span>);
      } else {
        pages.push(
          <a key={i} className="custom-pagination-link" href="#" onClick={e => { e.preventDefault(); fetchShopData(i); }}>{i}</a>
        );
      }
    }
    return (
      <div className="custom-pagination-wrapper">
        <div className="custom-pagination" style={{ overflowX: 'auto', maxWidth: '100%' }}>
          <span className={`custom-pagination-prev${pageNum === 1 ? ' disabled' : ''}`} onClick={() => pageNum > 1 && fetchShopData(pageNum - 1)}>&lt;</span>
          {pages}
          <a className={`custom-pagination-next${pageNum === totalPages ? ' disabled' : ''}`} href="#" onClick={e => { e.preventDefault(); if (pageNum < totalPages) fetchShopData(pageNum + 1); }}>&gt;</a>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none'
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <Steps type="nav" current={currentStep}>
          <Steps.Step title="登录" />
          <Steps.Step title="获取商品数据" />
        </Steps>
      </div>
      {initLoading ? (
        <div style={{ textAlign: 'center', marginTop: 60 }}>
          <Spin size="large" />
          <div style={{ marginTop: 16, fontSize: 16, color: '#888' }}>获取缓存数据...</div>
        </div>
      ) : currentStep === 0 ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div style={{ marginTop: 20, position: 'relative', minHeight:40, paddingBottom: 64 }}>
          <div style={{ marginBottom: 20, display: 'flex', gap: 10 }}>
            <Button
              onClick={() => fetchShopData(1)}
              loading={loading}
              type="primary"
            >
              获取商品数据
            </Button>
          </div>
          <ShopDetail
            shopData={shopData}
            totalCount={loginData?.totalCount}
            onExportData={handleExportData}
          />
          <div style={{ marginTop: 24 }}>
            {renderPagination()}
          </div>
        </div>
      )}
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
    </div>
  );
}
