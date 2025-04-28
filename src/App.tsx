import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';

// Layout components
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import VitalsDashboard from './pages/VitalsDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import EmergencyResponsePage from './pages/EmergencyResponsePage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="vitals" element={<VitalsDashboard />} />
                <Route path="hospital" element={<HospitalDashboard />} />
                <Route path="emergency/:id" element={<EmergencyResponsePage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;