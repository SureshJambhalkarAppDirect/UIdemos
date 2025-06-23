import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Group, Button } from '@mantine/core';
import CompaniesPage from './CompaniesPage';
import CompanyDetailPage from './CompanyDetailPage';
import AppDirectHeader from './AppDirectHeader';
import AppDirectSecondaryNav from './AppDirectSecondaryNav';

const CompanyFlow = () => {
  const navigate = useNavigate();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  const handleSelectCompany = (companyId: string) => {
    setSelectedCompanyId(companyId);
  };

  const handleBackToCompanies = () => {
    setSelectedCompanyId(null);
  };

  return (
    <Box style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Back to Home Navigation */}
      <Box style={{ backgroundColor: 'white', padding: '8px 16px', borderBottom: '1px solid #e0e0e0' }}>
        <Group>
          <Button onClick={() => navigate('/')} variant="outline" size="xs">
            🏠 Back to Home
          </Button>
        </Group>
      </Box>

      {/* AppDirect Header */}
      <AppDirectHeader />
      
      {/* Secondary Navigation */}
      <AppDirectSecondaryNav activeTab="companies" />
      
      {/* Main Content */}
      <Box style={{ padding: '24px', minHeight: 'calc(100vh - 156px)' }}>
        {selectedCompanyId ? (
          <CompanyDetailPage 
            companyId={selectedCompanyId} 
            onBack={handleBackToCompanies} 
          />
        ) : (
          <CompaniesPage onSelectCompany={handleSelectCompany} />
        )}
      </Box>
    </Box>
  );
};

export default CompanyFlow; 