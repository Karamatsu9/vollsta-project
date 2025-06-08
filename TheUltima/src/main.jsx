import { createRoot } from 'react-dom/client'
import Dashboard from './pages/Dashboard.jsx'
import ManagerDashboard from './pages/managerDashboard.jsx'
import Warehouse from './pages/warehouse.jsx'
import ManagerWarehouse from './pages/managerWarehouse.jsx'
import Transaction from './pages/Transaction.jsx'
import Chartt from './pages/chartt.jsx'
import UserList from './pages/UserList.jsx'

import Index from './pages/index.jsx'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotFound from './pages/404.jsx';

createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/managerDashboard" element={<ManagerDashboard />} />
      <Route path="/warehouse" element={<Warehouse />} />
      <Route path="/managerWarehouse" element={<ManagerWarehouse />} />
      <Route path="/Transaction" element={<Transaction />} />
      <Route path="/stockchart" element={<Chartt />} />
      <Route path="/userlist" element={<UserList />} />
      
      <Route path="/" element={<Index />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
)
