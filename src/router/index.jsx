import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Birthday from '../pages/Birthday/Birthday'
import SeatMap from '../pages/BidDetail/SeatMap/SeatMap'

const AppRoutes = () => (
  <Routes>
    <Route path="/home" element={<Home />} />
    <Route path="/birthday" element={<Birthday />} />
    <Route path="/seatMap" element={<SeatMap />} />
  </Routes>
)

export default AppRoutes
