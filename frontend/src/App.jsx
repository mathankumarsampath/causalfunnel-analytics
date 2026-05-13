import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import SessionDetail from './pages/SessionDetail';
import HeatmapPage from './pages/HeatmapPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="sessions/:sessionId" element={<SessionDetail />} />
          <Route path="heatmap" element={<HeatmapPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
