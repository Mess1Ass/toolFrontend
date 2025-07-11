import React, { useState } from "react";
import "./SeatMap.css";
import SeatStand from "./SeatStand";
import SeatZone from "./SeatZone";

export default function SeatMap() {
  const [selected, setSelected] = useState(null);

  const handleClick = (area, row, col, seatNum) => {
    setSelected({ area, row, col, seatNum });
    alert(`你点击了${area === "stand" ? "站区" : area === "seat" ? "座区" : "超级VIP区"} 第${row + 1}排 第${col + 1}号 座位号:${seatNum}`);
  };

  return (
    <div className="seatmap-container">
      <div className="stage">舞台</div>
      {/* 超级VIP中间3座位 */}
      <div className="seat-row" style={{ justifyContent: 'center', marginBottom: 12 }}>
        {[1, 2, 3].map((num) => (
          <div
            key={num}
            className="seat super-vip-seat"
            onClick={() => handleClick("super-vip", 0, num - 1, `S${num}`)}
          >
            {`S${num}`}
          </div>
        ))}
      </div>
      <SeatStand onSeatClick={handleClick} />
      <SeatZone onSeatClick={handleClick} />
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
