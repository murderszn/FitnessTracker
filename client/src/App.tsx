import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ContactsPage from './pages/contacts/ContactsPage';
import CompaniesPage from './pages/companies/CompaniesPage';
import DealsPage from './pages/deals/DealsPage';
import TasksPage from './pages/tasks/TasksPage';
import SalesPipeline from './pages/reports/SalesPipeline';
import ActivityReport from './pages/reports/ActivityReport';
import RevenueAnalytics from './pages/reports/RevenueAnalytics';
import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/reports/sales-pipeline" element={<SalesPipeline />} />
            <Route path="/reports/activity" element={<ActivityReport />} />
            <Route path="/reports/revenue" element={<RevenueAnalytics />} />
          </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;
