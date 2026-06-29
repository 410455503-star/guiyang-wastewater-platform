import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "@/components/Layout"
import Dashboard from "@/pages/Dashboard"
import Monitoring from "@/pages/Monitoring"
import Control from "@/pages/Control"
import Alarm from "@/pages/Alarm"
import Analysis from "@/pages/Analysis"
import Inspection from "@/pages/Inspection"
import Energy from "@/pages/Energy"
import System from "@/pages/System"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="monitoring" element={<Monitoring />} />
          <Route path="control" element={<Control />} />
          <Route path="alarm" element={<Alarm />} />
          <Route path="analysis" element={<Analysis />} />
          <Route path="inspection" element={<Inspection />} />
          <Route path="energy" element={<Energy />} />
          <Route path="system" element={<System />} />
        </Route>
      </Routes>
    </Router>
  )
}
