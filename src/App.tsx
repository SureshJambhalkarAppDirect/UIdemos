import React, { useState } from 'react';
import { Button, Group, Box, AppShell, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import AdditionalInfoModal from './AdditionalInfoModal';
import LinkedMembershipPage from './LinkedMembershipPage';
import CustomerDetailsPage from './CustomerDetailsPage';
import DummySidebar from './DummySidebar';
import LandingPage from './LandingPage';

function App() {
  const [modalOpened, setModalOpened] = useState(false);
  const [view, setView] = useState('home'); // 'home', 'modal', 'lm', or 'customerDetails'
  const [opened, { toggle }] = useDisclosure();

  const handleNavigateToDemo = (demo: string) => {
    setView(demo);
  };

  const isLandingPage = view === 'home';

  const demos = (
    <Box p="md">
      {!isLandingPage && (
        <Group mb="xl">
          <Button onClick={() => setView('home')} variant={view === 'home' ? 'filled' : 'outline'} size="xs">
            🏠 Home
          </Button>
          <Button onClick={() => setView('modal')} variant={view === 'modal' ? 'filled' : 'outline'} size="xs">
            Demo 1: Modal
          </Button>
          <Button onClick={() => setView('lm')} variant={view === 'lm' ? 'filled' : 'outline'} size="xs">
            Demo 2: LM Flow
          </Button>
           <Button onClick={() => setView('customerDetails')} variant={view === 'customerDetails' ? 'filled' : 'outline'} size="xs">
            Demo 3: Full Page
          </Button>
        </Group>
      )}

      {view === 'home' && <LandingPage onNavigateToDemo={handleNavigateToDemo} />}

      {view === 'modal' && (
        <>
          <AdditionalInfoModal
            opened={modalOpened}
            onClose={() => setModalOpened(false)}
          />
          <Button onClick={() => setModalOpened(true)}>
            Show Additional Information
          </Button>
        </>
      )}

      {view === 'lm' && <LinkedMembershipPage />}
      {view === 'customerDetails' && <CustomerDetailsPage />}
    </Box>
  );

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ 
        width: 300, 
        breakpoint: 'sm', 
        collapsed: { mobile: !opened, desktop: isLandingPage } 
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          {!isLandingPage && (
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          )}
          {/* You can add a header here if needed */}
        </Group>
      </AppShell.Header>
      {!isLandingPage && (
        <AppShell.Navbar p="md">
          <DummySidebar />
        </AppShell.Navbar>
      )}
      <AppShell.Main>{demos}</AppShell.Main>
    </AppShell>
  );
}

export default App; 