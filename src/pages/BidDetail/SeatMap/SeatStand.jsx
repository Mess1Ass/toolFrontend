import React from "react";

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

export default function SeatStand({ onSeatClick, seatData}) {
  const rowCount = standLeft.length;
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
                onClick={() => onSeatClick("stand", rowIdx, colIdx, seatNum)}
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
                onClick={() => onSeatClick("stand", rowIdx, colIdx, seatNum)}
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