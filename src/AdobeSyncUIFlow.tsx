import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Button, Group, Box, AppShell, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import DummySidebar from './DummySidebar';

const AdobeSyncUIFlow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [opened, { toggle }] = useDisclosure();

  // Determine current view from URL
  const getCurrentView = () => {
    const path = location.pathname;
    // Will add more specific paths as needed based on screenshots
    return 'home'; // default view
  };

  const currentView = getCurrentView();
  
  // Placeholder for the main home page
  const HomePage = () => (
    <Box style={{ 
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%',
      padding: '20px'
    }}>
      <h1>Adobe Sync UI</h1>
      <p>Components will be added based on screenshots</p>
    </Box>
  );

  return (
    <>
      {/* Navigation Bar */}
      <Box style={{ backgroundColor: 'white', padding: '8px 16px', position: 'sticky', top: 0, zIndex: 1000 }}>
        <Group>
          <Button onClick={() => navigate('/')} variant="outline" size="xs">
            🏠 Back to Home
          </Button>
          <Button 
            onClick={() => navigate('/adobesyncui')} 
            variant={currentView === 'home' ? 'filled' : 'outline'} 
            size="xs"
          >
            Home
          </Button>
          {/* Additional navigation buttons will be added as needed */}
        </Group>
      </Box>

      <AppShell
        header={{ height: 60 }}
        navbar={{ 
          width: 300, 
          breakpoint: 'sm', 
          collapsed: { mobile: !opened, desktop: false } 
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          </Group>
        </AppShell.Header>
        
        <AppShell.Navbar p="md">
          <DummySidebar />
        </AppShell.Navbar>
        
        <AppShell.Main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Additional routes will be added as needed */}
          </Routes>
        </AppShell.Main>
      </AppShell>
    </>
  );
};

export default AdobeSyncUIFlow; 