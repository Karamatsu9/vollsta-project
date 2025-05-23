import { createRoot } from 'react-dom/client'
import Dashboard from './Dashboard.jsx'
import Warehouse from './warehouse.jsx'
import Index from './index.jsx'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/warehouse" element={<Warehouse />} />
        <Route path="/login" element={<Index />} />
      </Routes>
    </Router>
)
