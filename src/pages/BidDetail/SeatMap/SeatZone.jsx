import React from "react";

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
  if (row === 2 && [1,3,5,7,9,11,13,15,17,19,21,23].includes(seatNum)) return seatTypeMap.vip;
  if (row === 3 && seatNum <= 20) return seatTypeMap.vip;
  if (row === 4 && seatNum <= 18) return seatTypeMap.vip;
  if (row === 2 && [2,4,6,8,10,12,14,16,18,20,22].includes(seatNum)) return seatTypeMap.cat;
  if (row === 6 && [1,3,5,7,9,11,13,15,17,19,21,23].includes(seatNum)) return seatTypeMap.cat;
  if (row === 6 && [2,4,6,8,10,12,14,16,18,20].includes(seatNum)) return seatTypeMap.douyin;
  return seatTypeMap.normal;
}

export default function SeatZone({ onSeatClick, seatData }) {
  return (
    <div className="seat-area">
      <div className="seat-left">
        {seatLeft.map((rowArr, rowIdx) => (
          <div className="seat-row" key={rowIdx}>
            {rowArr.map((seatNum, colIdx) => (
              <div
                key={colIdx}
                className={`seat ${getSeatType(rowIdx, colIdx, seatNum)}`}
                onClick={() => onSeatClick("seat", rowIdx, colIdx, seatNum)}
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
                onClick={() => onSeatClick("seat", rowIdx, colIdx, seatNum)}
              >
                {seatNum}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
