import React, { useState, useEffect, useRef } from "react";
import { Button, Toast, Modal } from "@douyinfe/semi-ui";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import ExcelViewer from "../ExcelViewer";
import "../css/SeatMap.css";
import axios from "axios";
import SeatStand from "./SeatStand";
import SeatZone from "./SeatZone";

export default function SeatMap() {
  const location = useLocation();
  const seatDataRaw = location.state?.seatData || [];
  const seatData = Array.isArray(seatDataRaw)
    ? seatDataRaw
    : (Array.isArray(seatDataRaw.data) ? seatDataRaw.data : []);
  const rawFilename = location.state?.filename || "未知文件";
  // 如果是Excel文件，去掉后缀
  const filename = rawFilename.endsWith('.xlsx') || rawFilename.endsWith('.xls')
    ? rawFilename.replace(/\.(xlsx|xls)$/i, '')
    : rawFilename;
  const [superVipMap, setSuperVipMap] = useState({});
  const [modalInfo, setModalInfo] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [showExcelViewer, setShowExcelViewer] = useState(false);
  const navigate = useNavigate();

  // 拖拽和缩放状态
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const contentRef = useRef(null);
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0 });
  const pinchRef = useRef({ isPinching: false, startDist: 0, startScale: 1 });
  // 优化拖动流畅度
  const rafRef = useRef();
  const nextTransformRef = useRef(transform);

  // --- 新增 seatsWrapperRef 用于事件绑定 ---
  const seatsWrapperRef = useRef(null);

  // 在组件挂载时添加事件监听器
  useEffect(() => {
    const seatsWrapper = seatsWrapperRef.current;
    if (!seatsWrapper) return;

    // --- Touch事件（移动端） ---
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        dragRef.current = {
          isDragging: true,
          startX: e.touches[0].clientX - transform.x,
          startY: e.touches[0].clientY - transform.y
        };
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        pinchRef.current = {
          isPinching: true,
          startDist: dist,
          startScale: transform.scale
        };
        dragRef.current.isDragging = false;
      }
    };

    const handleTouchMove = (e) => {
      if (dragRef.current.isDragging || pinchRef.current.isPinching) {
        e.preventDefault();
      }
      if (dragRef.current.isDragging && e.touches.length === 1) {
        const newX = e.touches[0].clientX - dragRef.current.startX;
        const newY = e.touches[0].clientY - dragRef.current.startY;
        nextTransformRef.current = { ...nextTransformRef.current, x: newX, y: newY };
        if (!rafRef.current) {
          rafRef.current = requestAnimationFrame(() => {
            setTransform(nextTransformRef.current);
            rafRef.current = null;
          });
        }
      } else if (pinchRef.current.isPinching && e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const scale = Math.min(Math.max(pinchRef.current.startScale * (dist / pinchRef.current.startDist), 0.5), 3);
        nextTransformRef.current = { ...nextTransformRef.current, scale };
        if (!rafRef.current) {
          rafRef.current = requestAnimationFrame(() => {
            setTransform(nextTransformRef.current);
            rafRef.current = null;
          });
        }
      }
    };

    const handleTouchEnd = () => {
      dragRef.current.isDragging = false;
      pinchRef.current.isPinching = false;
    };

    seatsWrapper.addEventListener('touchstart', handleTouchStart, { passive: true });
    seatsWrapper.addEventListener('touchmove', handleTouchMove, { passive: false });
    seatsWrapper.addEventListener('touchend', handleTouchEnd, { passive: true });
    seatsWrapper.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      seatsWrapper.removeEventListener('touchstart', handleTouchStart);
      seatsWrapper.removeEventListener('touchmove', handleTouchMove);
      seatsWrapper.removeEventListener('touchend', handleTouchEnd);
      seatsWrapper.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [transform.x, transform.y, transform.scale]);

  // 保证transform和nextTransformRef同步
  useEffect(() => {
    nextTransformRef.current = transform;
  }, [transform]);

  // 处理缩放按钮点击
  const handleZoom = (delta) => {
    setTransform(prev => ({
      ...prev,
      scale: Math.min(Math.max(prev.scale + delta, 0.5), 3)
    }));
  };

  // 重置变换
  const resetTransform = () => {
    setTransform({ x: 0, y: 0, scale: 1 });
  };

  // 处理超级VIP座位数据
  useEffect(() => {
    const superData = seatData.find(d => d.type === "超级");
    if (superData && Array.isArray(superData.rows)) {
      const map = {};
      superData.rows.forEach(item => {
        if (item.座位号 && item.出价状态 === "竞价成功") {
          map[item.座位号] = item;
        }
      });
      setSuperVipMap(map);
    }
  }, [seatData]);


  const legendTypes = [
    { key: 'super-vip-seat', label: '超级VIP座票', type: '超级' },
    { key: 'photo-vip-seat', label: '摄影/SVIP座票', type: ['摄影', 'SVIP'] },
    { key: 'vip-seat', label: 'VIP座票', type: 'VIP' },
    { key: 'bar-seat', label: '杆位站票', type: '杆位' },
    { key: 'stand-seat', label: '普通站票', type: '普站' },
    { key: 'normal-seat', label: '普通座票', type: '普座' },
    { key: 'cat-seat', label: '猫眼票务', type: '猫眼' },
    { key: 'douyin-seat', label: '抖音票务', type: '抖音' }
  ];



  // 点击座位弹窗
  const handleSuperVipClick = (pos) => {
    const item = superVipMap[pos];
    setModalInfo({
      title: `超级VIP-${pos}`,
      content: item ? (
        <div style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        }}>
          <div style={{
            padding: '16px 0',
            borderBottom: '1px solid #f0f0f0',
            marginBottom: '16px'
          }}>
            <div style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '8px'
            }}>
              出价人：{item.出价人}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '4px'
            }}>
              出价时间：{item.出价时间}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#666'
            }}>
              出价金额：<span style={{ color: '#f5222d', fontWeight: 'bold' }}>¥{item.出价金额}</span>
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#999',
          fontSize: '16px',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        }}>
          暂无数据
        </div>
      )
    });
  };

  // 查看Excel数据
  const handleViewExcel = (data) => {
    if (!data) {
      setShowExcelViewer(false);
      setExcelData(null);
      return;
    }

    // 确保我们有正确的数据结构
    const rows = data.rows || [];
    if (!Array.isArray(rows) || rows.length === 0) {
      Toast.error('暂无数据');
      setShowExcelViewer(false);
      return;
    }

    // 准备表格数据
    const excelData = {
      loading: false,
      columns: ['座位号', '出价人', '出价时间', '出价金额', '出价状态', '座位类型'],
      rows: rows.map(row => ({
        '座位号': row.座位号 || '-',
        '出价人': row.出价人 || '-',
        '出价时间': row.出价时间 || '-',
        '出价金额': row.出价金额 || '-',
        '出价状态': row.出价状态 || '-',
        '座位类型': row.座位类型 || '-'
      }))
    };

    // 如果有 datalist，添加到数据中（注意是小写的l）
    if (data.datalist && Array.isArray(data.datalist) && data.datalist.length > 0) {
      excelData.dataList = data.datalist; // 转换为 dataList 以匹配组件的预期
    }

    setExcelData(excelData);
    setShowExcelViewer(true);
  };



  return (
    <div className="seatmap-container" style={{
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none',
      paddingTop: '40px'
    }}>
      <Button
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 10
        }}
        onClick={() => navigate(-1)}
        theme="solid"
        type="secondary"
      >
        返回
      </Button>
      <div
        ref={contentRef}
        className="seatmap-content"
        style={{ position: 'relative', overflow: 'auto', height: '90vh' }}
      >
        <div
          ref={seatsWrapperRef}
          className="seats-wrapper"
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            minWidth: 800,
            minHeight: 600,
            background: '#fff',
            // position: 'absolute', // 移除
            // left: 0, top: 0, right: 0, bottom: 0, zIndex: 1 // 移除
          }}
        >
          <div style={{
            textAlign: 'center',
            marginBottom: 8,
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#333',
            position: 'relative'
          }}>
            {filename}
          </div>
          <div className="stage">舞台</div>
          {/* 超级VIP中间3座位 */}
          <div className="seat-row" style={{ justifyContent: 'center', marginBottom: 12 }}>
            {["左", "中", "右"].map((pos, idx) => (
              <div
                key={pos}
                className={`seat super-vip-seat${superVipMap[pos] ? " seat-has-user" : ""}`}
                onClick={() => handleSuperVipClick(pos)}
                style={{
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  transform: "scale(1)"
                }}
                title={superVipMap[pos] ? `出价人：${superVipMap[pos].出价人}` : "暂无数据"}
              >
                {`${pos}`}
              </div>
            ))}
          </div>
          <SeatStand seatData={seatData} />
          <SeatZone seatData={seatData} />
        </div>
      </div>
      {/* 图例和其他内容 */}
      <div className="legend-scroll-container" style={{
          marginTop: 24,
          position: 'static',
          left: undefined,
          right: undefined,
          bottom: undefined,
          zIndex: undefined,
           background: 'transparent',
        }}>
          <div className="legend">
            {legendTypes.map(item => {
              const matchedItems = seatData.filter(d => {
                if (!d.type) return false;
                if (Array.isArray(item.type)) {
                  // 如果是数组，检查数组中的任何类型是否包含在数据类型中
                  return item.type.some(t => d.type.includes(t));
                }
                // 检查数据类型是否包含当前类型
                return d.type.includes(item.type);
              });

              const hasData = matchedItems.length > 0;
              return (
                <div key={item.key}>
                  <div className="legend-labels">
                    <span
                      className={`legend-item ${item.key}`}
                      style={{ cursor: 'pointer' }}
                    >
                      {item.label}
                    </span>
                  </div>
                  {hasData && (
                    <Button
                      size="small"
                      style={{ width: 90 }}
                      onClick={() => {
                        const item = matchedItems[0];
                        handleViewExcel(item);
                      }}
                    >
                      查看具体信息
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      <div className="zoom-controls">
        <button className="zoom-button" onClick={() => handleZoom(0.1)}>+</button>
        <button className="zoom-button" onClick={() => handleZoom(-0.1)}>-</button>
        <button className="zoom-button" onClick={resetTransform}>↺</button>
      </div>

      <Modal
        visible={!!modalInfo}
        title={modalInfo?.title}
        onCancel={() => setModalInfo(null)}
        footer={null}
        width={400}
        centered
        maskClosable={true}
        destroyOnClose={true}
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        }}
      >
        {modalInfo?.content}
      </Modal>

      <ExcelViewer
        visible={showExcelViewer}
        data={excelData}
        onClose={() => handleViewExcel(null)}
      />
    </div>
  );
}
