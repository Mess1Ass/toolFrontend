import React, { useState, useEffect } from 'react';
import './css/ShopDetail.css';
import axios from 'axios';
import config from '../../config';

export default function ShopDetail({ shopData, totalCount, onExportData }) {
  const [selectedItems, setSelectedItems] = useState(new Set());

  useEffect(() => {
    console.log(shopData);
  }, [shopData]);

  // 选择/取消选择商品
  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // 全选/取消全选
  const handleSelectAll = () => {
    if (selectedItems.size === shopData.items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(shopData.items.map(item => item.item_id)));
    }
  };

  // 获取选中商品数据
  const getSelectedItemsData = () => {
    return shopData.items
      .filter(item => selectedItems.has(item.item_id))
      .map(item => ({
        itemId: item.item_id,
        title: item.title,
        url: item.url
      }));
  };

  // 导出竞价数据
  const handleExportData = () => {
    const selectedData = getSelectedItemsData();
    if (selectedData.length === 0) {
      alert('请先选择要导出的商品');
      return;
    }
    if (onExportData) {
      onExportData(selectedData);
    }
  };

  // 商品详情弹窗
  const handleViewDetail = async (item) => {
    const loginData = JSON.parse(sessionStorage.getItem('loginData'));
    if (!loginData) {
      alert('请先登录');
      return;
    }
    try {
      const cookieString = loginData.cookies
        .map(cookie => `${cookie.name}=${cookie.value}`)
        .join('; ');
      const response = await axios.post(`${config.API_BASE_URL}/api/item`, {
        url: item.url,
        cookies: cookieString
      });
      if (response.data.status === 200) {
        console.log(response.data.data);
        const win = window.open();
        win.document.write(response.data.data);
        win.document.close();
      } else {
        alert(response.data.error || '获取详情失败');
      }
    } catch (err) {
      alert('请求失败：' + err.message);
    }
  };

  if (!shopData) return <div>暂无数据</div>;

  return (
    <>
      <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label className="shopdetail-select-all" style={{ marginRight: 10 }}>
            <input
              type="checkbox"
              className="shopdetail-select-all"
              checked={selectedItems.size === shopData.items.length && shopData.items.length > 0}
              onChange={handleSelectAll}
            />
            全选
          </label>
          <span style={{ color: '#666' }}>
            已选择 {selectedItems.size} 个商品
          </span>
        </div>
        <button
          onClick={handleExportData}
          disabled={selectedItems.size === 0}
          style={{
            padding: '8px 16px',
            backgroundColor: selectedItems.size > 0 ? '#f17fb0' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: selectedItems.size > 0 ? 'pointer' : 'not-allowed'
          }}
        >
          导出竞价数据
        </button>
      </div>
      <div className="goods">
        {shopData.items.map(item => (
          <div className="gs_xx" key={item.item_id} style={{ position: 'relative' }}>
            <div
              className="shopdetail-item-checkbox-wrapper"
            >
              <input
                type="checkbox"
                className="shopdetail-item-checkbox"
                checked={selectedItems.has(item.item_id)}
                onChange={() => handleSelectItem(item.item_id)}
              />
            </div>
            <ul>
              <li className="gs_1">
                <a href="#" onClick={e => { e.preventDefault(); handleViewDetail(item); }}>
                  <img src={item.image} width="285" height="285" alt={item.title} />
                </a>
              </li>
              <li className="gs_2">
                <a href="#" onClick={e => { e.preventDefault(); handleViewDetail(item); }}>{item.title}</a>
              </li>
              <li className="gs_3">
                <span className="icon ic_1">{item.brand || 'SNH48'}</span>
                <span className="icon ic_xh">{item.stock_type || '现货'}</span>
                <span className="icon ic_xn">{item.virtual ? '虚拟商品' : ''}</span>
                <span className="icon ic_p">竞</span>
              </li>
              <li className={`gs_4 list_text_auction_price_${item.item_id}`}>
                当前积分：<span className="jg">{item.price}</span>
              </li>
              <li className="gs_l"></li>
              <li className="gs_6">
                <span className={`icon ic_cj list_text_auction_count_${item.item_id}`}>{item.bid_count}</span>
                <span>
                  竞价状态：{item.status}
                  <br />
                </span>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}


