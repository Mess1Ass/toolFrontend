import React, { useState, useEffect } from "react";
import { Modal } from "@douyinfe/semi-ui";

const seatTypeMap = {
  photoVip: "photo-vip-seat",
  vip: "vip-seat",
  cat: "cat-seat",
  douyin: "douyin-seat",
  normal: "normal-seat",
};

const seatLeft = [
  [24,22,20,18,16,14,12,10,8,6,4,2],
  [24,22,20,18,16,14,12,10,8,6,4,2],
  [24,22,20,18,16,14,12,10,8,6,4,2],
  [24,22,20,18,16,14,12,10,8,6,4,2],
  [24,22,20,18,16,14,12,10,8,6,4,2],
  [24,22,20,18,16,14,12,10,8,6,4,2],
  [24,22,20,18,16,14,12,10,8,6,4,2],
  [24,22,20,18,16,14,12,10,8,6,4,2],
  [24,22,20,18,16,14,12,10,8,6,4,2],
  [24,22,20,18,16,14,12,10,8,6,4,2],
];
const seatRight = [
  [1,3,5,7,9,11,13,15,17,19,21,23],
  [1,3,5,7,9,11,13,15,17,19,21,23],
  [1,3,5,7,9,11,13,15,17,19,21,23],
  [1,3,5,7,9,11,13,15,17,19,21,23],
  [1,3,5,7,9,11,13,15,17,19,21,23],
  [1,3,5,7,9,11,13,15,17,19,21,23],
  [1,3,5,7,9,11,13,15,17,19,21,23],
  [1,3,5,7,9,11,13,15,17,19,21,23],
  [1,3,5,7,9,11,13,15,17,19,21,23],
  [1,3,5,7,9,11,13,15,17,19,21,23],
];

function getSeatType(row, col, seatNum) {
  if (row === 0) return seatTypeMap.photoVip;
  if (row === 1) return seatTypeMap.vip;
  if (row === 2 && [1,3,5,7,9,11,13,15,17,19,21].includes(seatNum)) return seatTypeMap.vip;
  if (row === 3 && seatNum <= 20) return seatTypeMap.vip;
  if (row === 4 && seatNum <= 18) return seatTypeMap.vip;
  if (row === 2 && [2,4,6,8,10,12,14,16,18,20,22].includes(seatNum)) return seatTypeMap.cat;
  if (row === 6 && [1,3,5,7,9,11,13,15,17,19,21,23].includes(seatNum)) return seatTypeMap.cat;
  if (row === 6 && [2,4,6,8,10,12,14,16,18,20].includes(seatNum)) return seatTypeMap.douyin;
  return seatTypeMap.normal;
}

function getSeatName(row, col, seatNum) {
  if (row === 0) return "摄影/SVIP";
  if (row === 1) return "VIP";
  if (row === 2 && seatNum <= 22) return "VIP";
  if (row === 3 && seatNum <= 20) return "VIP";
  if (row === 4 && seatNum <= 18) return "VIP";
  return "普座";
}

export default function SeatZone({ seatData }) {
  const [photoVipMap, setPhotoVipMap] = useState({});
  const [vipMap, setVipMap] = useState({});
  const [catMap, setCatMap] = useState({});
  const [douyinMap, setDouyinMap] = useState({});
  const [normalMap, setNormalMap] = useState({});
  const [modalInfo, setModalInfo] = useState(null);

  // 处理超级VIP座位数据
  useEffect(() => {
    const normalData = seatData.find(d => d.type === "普座");
    if (normalData && Array.isArray(normalData.rows)) {
      const map = {};
      normalData.rows.forEach(item => {
        if (item.座位号 && item.出价状态 === "竞价成功") {
          map[item.座位号] = item;
        }
      });
      setNormalMap(map);
    }

    const vipData = seatData.find(d => d.type === "VIP");
    if (vipData && Array.isArray(vipData.rows)) {
      const map = {};
      vipData.rows.forEach(item => {
        if (item.座位号 && item.出价状态 === "竞价成功") {
          map[item.座位号] = item;
        }
      });
      setVipMap(map);
    }

    const photoVipData = seatData.find(d => d.type === "摄影" || d.type === "SVIP");
    if (photoVipData && Array.isArray(photoVipData.rows)) {
      const map = {};
      photoVipData.rows.forEach(item => {
        if (item.座位号 && item.出价状态 === "竞价成功") {
          map[item.座位号] = item;
        }
      });
      setPhotoVipMap(map);
    }
  }, [seatData]);


  const handleSeatClick = (type, rowIdx, colIdx, seatNum) => {
    let item = []
    let seatName = ( rowIdx + 1 ) + "排" + seatNum
    if(type === "摄影/SVIP"){
      item = photoVipMap[seatName];
    }else if(type === "VIP"){
      item = vipMap[seatName];
    }else if(type === "普座"){
      item = normalMap[seatName];
    }

    setModalInfo({
      title: `${type}-${seatName}`,
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

  
  return (
    <div className="seat-area">
      <div className="seat-left">
        {seatLeft.map((rowArr, rowIdx) => (
          <div className="seat-row" key={rowIdx}>
            {rowArr.map((seatNum, colIdx) => (
              <div
                key={colIdx}
                className={`seat ${getSeatType(rowIdx, colIdx, seatNum)}`}
                onClick={() => handleSeatClick(getSeatName(rowIdx, colIdx, seatNum), rowIdx, colIdx, seatNum)}
              >
                {seatNum}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="seat-right">
        {seatRight.map((rowArr, rowIdx) => (
          <div className="seat-row" key={rowIdx}>
            {rowArr.map((seatNum, colIdx) => (
              <div
                key={colIdx}
                className={`seat ${getSeatType(rowIdx, colIdx, seatNum)}`}
                onClick={() => handleSeatClick(getSeatName(rowIdx, colIdx, seatNum), rowIdx, colIdx, seatNum)}
              >
                {seatNum}
              </div>
            ))}
          </div>
        ))}
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
    </div>
  );
}
