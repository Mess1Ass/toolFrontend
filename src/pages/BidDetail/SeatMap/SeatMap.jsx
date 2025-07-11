import React, { useState, useEffect, useRef } from "react";
import { Button } from "@douyinfe/semi-ui";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./SeatMap.css";
import axios from "axios";
import SeatStand from "./SeatStand";
import SeatZone from "./SeatZone";
import config from "../../../config";

export default function SeatMap() {
  const location = useLocation();
  const seatDataRaw = location.state?.seatData || [];
  const seatData = Array.isArray(seatDataRaw)
    ? seatDataRaw
    : (Array.isArray(seatDataRaw.data) ? seatDataRaw.data : []);
  const [selected, setSelected] = useState(null);
  const { itemId } = useParams(); // 实际上是 item_id
  const [superVipMap, setSuperVipMap] = useState({});
  const [modalInfo, setModalInfo] = useState(null);
  const [type, setType] = useState(null);
  const navigate = useNavigate();
  const calledRef = useRef(false);

  // 处理超级VIP座位数据
  useEffect(() => {
    const superData = seatData.find(d => d.type === "超级");
    console.log(superData);
    if (superData && Array.isArray(superData.rows)) {
      const map = {};
      superData.row.forEach(item => {
        if (item.座位号 && item.出价状态 === "竞价成功") {
          map[item.座位号] = item;
        }
      });
      setSuperVipMap(map);
    }
  }, [seatData]);

  // 点击座位弹窗
  const handleSuperVipClick = (pos) => {
    const item = superVipMap[pos];
    setModalInfo({
      title: `超级VIP-${pos}`,
      content: item ? (
        <div>
          <div>出价人：{item.出价人}</div>
          <div>出价时间：{item.出价时间}</div>
          <div>出价金额：{item.出价金额}</div>
        </div>
      ) : (
        <div>暂无数据</div>
      )
    });
  };


  const handleClick = (area, row, col, seatNum) => {
    setSelected({ area, row, col, seatNum });
    alert(`你点击了${area === "stand" ? "站区" : area === "seat" ? "座区" : "超级VIP区"} 第${row + 1}排 第${col + 1}号 座位号:${seatNum}`);
  };

  return (
    <div className="seatmap-container">
      {/* 右上角返回按钮 */}
      <Button
        style={{
          position: "absolute",
          top: 24,
          right: 32,
          zIndex: 10
        }}
        onClick={() => navigate(-1)}
        theme="solid"
        type="secondary"
      >
        返回
      </Button>
      <div className="stage">舞台</div>
      {/* 超级VIP中间3座位 */}
      <div className="seat-row" style={{ justifyContent: 'center', marginBottom: 12 }}>
        {["左", "中", "右"].map((pos, idx) => (
          <div
            key={pos}
            className={`seat super-vip-seat${superVipMap[pos] ? " seat-has-user" : ""}`}
            onClick={() => handleSuperVipClick(pos)}
            style={{ cursor: "pointer" }}
            title={superVipMap[pos] ? `出价人：${superVipMap[pos].出价人}` : "暂无数据"}
          >
            {`${pos}`}
            {superVipMap[pos] && <span className="seat-user">{superVipMap[pos].出价人}</span>}
          </div>
        ))}
      </div>
      <SeatStand onSeatClick={handleClick} seatData={seatData} />
      <SeatZone onSeatClick={handleClick} seatData={seatData} />
      <div className="legend">
        <span className="legend-item super-vip-seat">超级VIP座票</span>
        <span className="legend-item photo-vip-seat">摄影VIP座票</span>
        <span className="legend-item vip-seat">VIP座票</span>
        <span className="legend-item bar-seat">杆位站票</span>
        <span className="legend-item stand-seat">普通站票</span>
        <span className="legend-item normal-seat">普通座票</span>
        <span className="legend-item cat-seat">猫眼票务</span>
        <span className="legend-item douyin-seat">抖音票务</span>
      </div>
    </div>
  );
}
