import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import BusinessSettings from './components/BusinessSettings';
import TeamManagement from './components/TeamManagement';
import TenantView from './components/TenantView';
import Login from './components/Login';
import { AuthService } from './services/AuthService';

const App: React.FC = () => {
  const isAuthenticated = AuthService.getCurrentUser() !== null;
  const isSuperAdmin = AuthService.isSuperAdmin();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/admin" 
        element={
          isAuthenticated && isSuperAdmin ? <AdminDashboard /> : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="/business-settings/:tenantId" 
        element={
          isAuthenticated ? <BusinessSettings /> : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="/team-management/:tenantId" 
        element={
          isAuthenticated ? <TeamManagement /> : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="/tenant-view/:tenantId" 
        element={<TenantView />} 
      />
      <Route 
        path="/" 
        element={
          isAuthenticated ? 
            (isSuperAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/tenant-view/:tenantId" replace />) 
            : <Navigate to="/login" replace />
        } 
      />
    </Routes>
  );
};

export default App;