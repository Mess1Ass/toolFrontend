import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Birthday from '../pages/Birthday/Birthday'

const AppRoutes = () => (
  <Routes>
    <Route path="/home" element={<Home />} />
    <Route path="/birthday" element={<Birthday />} />
  </Routes>
)

export default AppRoutes
