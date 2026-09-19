import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Cases from './pages/Cases';
import CaseDetail from './pages/CaseDetail';
import NewAssessment from './pages/NewAssessment';
import SupportActions from './pages/SupportActions';
import Referrals from './pages/Referrals';
import AuditLog from './pages/AuditLog';
import Privacy from './pages/Privacy';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/cases/:caseId" element={<CaseDetail />} />
          <Route path="/new-assessment" element={<NewAssessment />} />
          <Route path="/support-actions" element={<SupportActions />} />
          <Route path="/referrals" element={<Referrals />} />
          <Route path="/audit-log" element={<AuditLog />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
