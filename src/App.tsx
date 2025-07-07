import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import LGAFlow from './LGAFlow';
import CompanyFlow from './CompanyFlow';
import AdobeSyncUIFlow from './AdobeSyncUIFlow';
import AppInsightsAIFlow from './AppInsightsAIFlow';
import AdobeRecommendationsFlow from './AdobeRecommendationsFlow';
import AdminFlow from './AdminFlow';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/lga-flow/*" element={<LGAFlow />} />
        <Route path="/company-flow/*" element={<CompanyFlow />} />
        <Route path="/adobesyncui/*" element={<AdobeSyncUIFlow />} />
        <Route path="/appinsights-ai/*" element={<AppInsightsAIFlow />} />
        <Route path="/adobe-recommendations/*" element={<AdobeRecommendationsFlow />} />
        <Route path="/admin/*" element={<AdminFlow />} />
      </Routes>
    </Router>
  );
}

export default App; 