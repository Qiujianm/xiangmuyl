import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NDAFlow from './pages/NDAFlow';
import AdminTokenPage from './pages/AdminTokenPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/token" element={<AdminTokenPage />} />
        <Route path="/*" element={<NDAFlow />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;