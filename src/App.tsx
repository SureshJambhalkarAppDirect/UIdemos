import React, { useState } from 'react';
import { Button, Group, Box, AppShell, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import AdditionalInfoModal from './AdditionalInfoModal';
import LinkedMembershipPage from './LinkedMembershipPage';
import CustomerDetailsPage from './CustomerDetailsPage';
import DummySidebar from './DummySidebar';

function App() {
  const [modalOpened, setModalOpened] = useState(false);
  const [view, setView] = useState('customerDetails'); // 'modal', 'lm', or 'customerDetails'
  const [opened, { toggle }] = useDisclosure();

  const demos = (
    <Box p="md">
       <Group mb="xl">
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
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          {/* You can add a header here if needed */}
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <DummySidebar />
      </AppShell.Navbar>
      <AppShell.Main>{demos}</AppShell.Main>
    </AppShell>
  );
}

export default App; 