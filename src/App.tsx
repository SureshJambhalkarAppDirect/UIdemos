import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import LGAFlow from './LGAFlow';
import CompanyFlow from './CompanyFlow';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/lga-flow/*" element={<LGAFlow />} />
        <Route path="/company-flow/*" element={<CompanyFlow />} />
      </Routes>
    </Router>
  );
}

export default App; 