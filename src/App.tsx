import React, { useState } from 'react';
import { Button, Group, Box, AppShell, Burger, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import AdditionalInfoModal from './AdditionalInfoModal';
import LinkedMembershipPage from './LinkedMembershipPage';
import MarketplaceInterface from './MarketplaceInterface';
import CustomerDetailsPage from './CustomerDetailsPage';
import DummySidebar from './DummySidebar';
import LandingPage from './LandingPage';

function App() {
  const [modalOpened, setModalOpened] = useState(false);
  const [modalScenario, setModalScenario] = useState<'visible' | 'hidden' | null>(null);
  const [view, setView] = useState('home'); // 'home', 'modal', 'lm', or 'customerDetails'
  const [opened, { toggle }] = useDisclosure();

  const handleNavigateToDemo = (demo: string) => {
    setView(demo);
  };

  const handleOpenModal = (scenario: 'visible' | 'hidden') => {
    setModalScenario(scenario);
    setModalOpened(true);
  };

  const handleCloseModal = () => {
    setModalOpened(false);
    setModalScenario(null);
  };

  // Mock data scenarios
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

  const isLandingPage = view === 'home';
  const shouldHideSidebar = view === 'home' || view === 'modal' || view === 'lm';
  const showTopNavigation = view !== 'home'; // Only show for AC-14371 cases, not landing page

  const demos = view === 'modal' ? (
    <Box style={{ height: '100%', width: '100%' }}>
      <MarketplaceInterface 
        mockDataScenarios={mockDataScenarios} 
        onNavigate={setView}
      />
    </Box>
  ) : (
    <Box style={{ 
      maxWidth: shouldHideSidebar ? '1200px' : 'none',
      margin: shouldHideSidebar ? '0 auto' : '0',
      width: '100%',
      padding: view === 'lm' ? '0 16px' : 0,
      marginTop: view === 'lm' ? '-16px' : 0
    }}>
      {view === 'home' && <LandingPage onNavigateToDemo={handleNavigateToDemo} />}

      {view === 'lm' && <LinkedMembershipPage />}
      {view === 'customerDetails' && <CustomerDetailsPage />}
    </Box>
  );

  return (
    <>
      {/* AC-14371 Context Navigation - Only for cases */}
      {showTopNavigation && (
        <Box style={{ backgroundColor: 'white', padding: '8px 16px', position: 'sticky', top: 0, zIndex: 1000 }}>
          <Group>
            <Button onClick={() => setView('home')} variant={view === 'home' ? 'filled' : 'outline'} size="xs">
              🏠 Home
            </Button>
            <Button onClick={() => setView('modal')} variant={view === 'modal' ? 'filled' : 'outline'} size="xs">
              Case: Create and Convert
            </Button>
            <Button onClick={() => setView('lm')} variant={view === 'lm' ? 'filled' : 'outline'} size="xs">
              Case: Join existing LM
            </Button>
            <Button onClick={() => setView('customerDetails')} variant={view === 'customerDetails' ? 'filled' : 'outline'} size="xs">
              Full Page
            </Button>
          </Group>
        </Box>
      )}

      <AppShell
        header={view === 'modal' || view === 'home' ? undefined : { height: 60 }}
        navbar={{ 
          width: 300, 
          breakpoint: 'sm', 
          collapsed: { mobile: !opened, desktop: shouldHideSidebar } 
        }}
        padding="md"
      >
        {view !== 'modal' && view !== 'home' && (
          <AppShell.Header>
            <Group h="100%" px="md">
              {!shouldHideSidebar && (
                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
              )}
              {/* You can add a header here if needed */}
            </Group>
          </AppShell.Header>
        )}
        {!shouldHideSidebar && (
          <AppShell.Navbar p="md">
            <DummySidebar />
          </AppShell.Navbar>
        )}
        <AppShell.Main>{demos}</AppShell.Main>
      </AppShell>
    </>
  );
}

export default App; 