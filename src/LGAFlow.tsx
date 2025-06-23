import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Button, Group, Box, AppShell, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import AdditionalInfoModal from './AdditionalInfoModal';
import LinkedMembershipPage from './LinkedMembershipPage';
import MarketplaceInterface from './MarketplaceInterface';
import CustomerDetailsPage from './CustomerDetailsPage';
import DummySidebar from './DummySidebar';

const LGAFlow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [modalOpened, setModalOpened] = useState(false);
  const [modalScenario, setModalScenario] = useState<'visible' | 'hidden' | null>(null);
  const [opened, { toggle }] = useDisclosure();

  const handleOpenModal = (scenario: 'visible' | 'hidden') => {
    setModalScenario(scenario);
    setModalOpened(true);
  };

  const handleCloseModal = () => {
    setModalOpened(false);
    setModalScenario(null);
  };

  // Mock data scenarios - preserved exactly from original App.tsx
  const mockDataScenarios = {
    visible: {
      anniversaryDate: '2025-07-01', // Within AD-30 window (about 15 days from June 16, 2025)
      hasLinkedMembership: false, // Not part of LM
      has3YCCommitment: false, // Not committed to 3YC
      renewalQuantity: 150, // >100
      defaultMarketSegment: 'Government', // Government
      defaultMarketSubSegment: 'Federal', // Sub-segment selected
      defaultCountry: 'United States' // US/Canada
    },
    hidden: {
      anniversaryDate: '2025-08-15', // Beyond AD-30 window (60+ days)
      hasLinkedMembership: true, // Part of active LM
      has3YCCommitment: true, // Committed to 3YC
      renewalQuantity: 50, // <=100
      defaultMarketSegment: 'Commercial', // Not Government
      defaultMarketSubSegment: '', // No sub-segment
      defaultCountry: 'Mexico' // Not US/Canada
    }
  };

  // Determine current view from URL
  const getCurrentView = () => {
    const path = location.pathname;
    if (path.includes('/linked-membership')) return 'lm';
    if (path.includes('/customer-details')) return 'customerDetails';
    return 'modal'; // default to create-and-convert
  };

  const currentView = getCurrentView();
  const shouldHideSidebar = currentView === 'modal' || currentView === 'lm';

  const handleNavigation = (view: string) => {
    switch (view) {
      case 'modal':
        navigate('/lga-flow/create-and-convert');
        break;
      case 'lm':
        navigate('/lga-flow/linked-membership');
        break;
      case 'customerDetails':
        navigate('/lga-flow/customer-details');
        break;
      default:
        navigate('/lga-flow/create-and-convert');
    }
  };

  const CreateAndConvertPage = () => (
    <Box style={{ height: '100%', width: '100%' }}>
      <MarketplaceInterface 
        mockDataScenarios={mockDataScenarios} 
        onNavigate={handleNavigation}
      />
    </Box>
  );

  const LinkedMembershipPageWrapper = () => (
    <Box style={{ 
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%',
      padding: '0 16px',
      marginTop: '-16px'
    }}>
      <LinkedMembershipPage />
    </Box>
  );

  const CustomerDetailsPageWrapper = () => (
    <Box style={{ 
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%'
    }}>
      <CustomerDetailsPage />
    </Box>
  );

  return (
    <>
      {/* AC-14371 Internal Navigation - Preserved exactly with routing */}
      <Box style={{ backgroundColor: 'white', padding: '8px 16px', position: 'sticky', top: 0, zIndex: 1000 }}>
        <Group>
          <Button onClick={() => navigate('/')} variant="outline" size="xs">
            🏠 Back to Home
          </Button>
          <Button 
            onClick={() => handleNavigation('modal')} 
            variant={currentView === 'modal' ? 'filled' : 'outline'} 
            size="xs"
          >
            Case: Create and Convert
          </Button>
          <Button 
            onClick={() => handleNavigation('lm')} 
            variant={currentView === 'lm' ? 'filled' : 'outline'} 
            size="xs"
          >
            Case: Join existing LM
          </Button>
          <Button 
            onClick={() => handleNavigation('customerDetails')} 
            variant={currentView === 'customerDetails' ? 'filled' : 'outline'} 
            size="xs"
          >
            Full Page
          </Button>
        </Group>
      </Box>

      <AppShell
        header={currentView === 'modal' ? undefined : { height: 60 }}
        navbar={{ 
          width: 300, 
          breakpoint: 'sm', 
          collapsed: { mobile: !opened, desktop: shouldHideSidebar } 
        }}
        padding="md"
      >
        {currentView !== 'modal' && (
          <AppShell.Header>
            <Group h="100%" px="md">
              {!shouldHideSidebar && (
                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
              )}
            </Group>
          </AppShell.Header>
        )}
        {!shouldHideSidebar && (
          <AppShell.Navbar p="md">
            <DummySidebar />
          </AppShell.Navbar>
        )}
        <AppShell.Main>
          <Routes>
            <Route path="/" element={<CreateAndConvertPage />} />
            <Route path="/create-and-convert" element={<CreateAndConvertPage />} />
            <Route path="/linked-membership" element={<LinkedMembershipPageWrapper />} />
            <Route path="/customer-details" element={<CustomerDetailsPageWrapper />} />
          </Routes>
        </AppShell.Main>
      </AppShell>
    </>
  );
};

export default LGAFlow; 