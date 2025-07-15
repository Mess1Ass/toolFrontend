import React, { useState, useEffect } from "react";
import { Modal } from "@douyinfe/semi-ui";

const standLeft = [
  [24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2],
  [44, 42, 40, 38, 36, 34, 32, 30, 28, 26],
  [64, 62, 60, 58, 56, 54, 52, 50, 48, 46],
  [84, 82, 80, 78, 76, 74, 72, 70, 68, 66],
  [100, 98, 96, 94, 92, 90, 88, 86],
];
const standRight = [
  [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23],
  [25, 27, 29, 31, 33, 35, 37, 39, 41, 43],
  [45, 47, 49, 51, 53, 55, 57, 59, 61, 63],
  [65, 67, 69, 71, 73, 75, 77, 79, 81, 83],
  [85, 87, 89, 91, 93, 95, 97, 99],
];

// rowIdx=0为杆位站票（bar-seat），其余为普通站票（stand-seat）
function getSeatType(rowIdx) {
  if (rowIdx === 0) return "bar-seat";
  return "stand-seat";
}

export default function SeatStand({ seatData }) {
  const rowCount = standLeft.length;
  const [barMap, setBarMap] = useState({});
  const [standMap, setStandMap] = useState({});
  const [modalInfo, setModalInfo] = useState(null);


  // 处理超级VIP座位数据
  useEffect(() => {
    const barData = seatData.find(d => d.type === "杆位");
    if (barData && Array.isArray(barData.rows)) {
      const map = {};
      barData.rows.forEach(item => {
        if (item.座位号 && item.出价状态 === "竞价成功") {
          map[item.座位号] = item;
        }
      });
      setBarMap(map);
    }

    const standData = seatData.find(d => d.type === "普站");
    if (standData && Array.isArray(standData.rows)) {
      const map = {};
      standData.rows.forEach(item => {
        if (item.座位号 && item.出价状态 === "竞价成功") {
          map[item.座位号] = item;
        }
      });
      setStandMap(map);
    }
  }, [seatData]);

  const handleSeatClick = (rowIdx, colIdx, seatNum) => {
    let item = []
    if(rowIdx === 0){
      item = barMap[seatNum];
    }else{
      item = standMap[seatNum];
    }
    setModalInfo({
      title: rowIdx === 0 ? `杆位-${seatNum}` : `站区-${seatNum}`,
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
    <div className="stand-area">
      <div className="stand-left">
        {standLeft.map((rowArr, rowIdx) => (
          <div className="seat-row" key={rowIdx}>
            {rowIdx >= 1 && rowIdx <= 3 && <div className="seat empty-seat" />}
            {rowIdx === 4 && (
              <>
                <div className="seat empty-seat" />
                <div className="seat empty-seat" />
              </>
            )}
            {rowArr.map((seatNum, colIdx) => (
              <div
                key={colIdx}
                className={`seat ${getSeatType(rowIdx)}`}
                onClick={() => handleSeatClick(rowIdx, colIdx, seatNum)}
              >
                {seatNum}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="stand-right">
        {standRight.map((rowArr, rowIdx) => (
          <div className="seat-row" key={rowIdx}>
            {rowIdx >= 1 && rowIdx <= 3 && <div className="seat empty-seat" />}
            {rowIdx === 4 && (
              <>
                <div className="seat empty-seat" />
                <div className="seat empty-seat" />
              </>
            )}
            {rowArr.map((seatNum, colIdx) => (
              <div
                key={colIdx}
                className={`seat ${getSeatType(rowIdx)}`}
                onClick={() => handleSeatClick(rowIdx, colIdx, seatNum)}
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