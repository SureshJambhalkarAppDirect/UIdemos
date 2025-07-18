import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container, Button, Stack, ScrollArea, ActionIcon, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconArrowLeft } from '@tabler/icons-react';
import { AdobeAuthPanel } from './components/AdobeAuthPanel';
import { FlexibleDiscounts } from './components/FlexibleDiscounts';
import { PriceLists } from './components/PriceLists';
import { AdobeRecommendations } from './components/AdobeRecommendations';
import { AuthenticationStatus } from './services/adobeAuth';

const AdobeNewFunctionalitiesFlow: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/adobe-new-functionalities/home" replace />} />
      <Route path="/home" element={<AdobeNewFunctionalitiesHome />} />
    </Routes>
  );
};

const AdobeNewFunctionalitiesHome: React.FC = () => {
  const navigate = useNavigate();
  const [authStatus, setAuthStatus] = useState<AuthenticationStatus>({ isAuthenticated: false, status: 'disconnected' });
  const [flexDiscountsExpanded, setFlexDiscountsExpanded] = useState(false);
  const [priceListsExpanded, setPriceListsExpanded] = useState(false);
  const [recommendationsExpanded, setRecommendationsExpanded] = useState(false);

  const handleAuthStatusChange = (status: AuthenticationStatus) => {
    setAuthStatus(status);
  };

  return (
    <Box 
      style={{ 
        minHeight: '100vh', 
        backgroundColor: '#F8F9FA',
        backgroundImage: `
          linear-gradient(rgba(34, 197, 94, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34, 197, 94, 0.05) 1px, transparent 1px),
          linear-gradient(rgba(34, 197, 94, 0.03) 0.5px, transparent 0.5px),
          linear-gradient(90deg, rgba(34, 197, 94, 0.03) 0.5px, transparent 0.5px)
        `,
        backgroundSize: '40px 40px, 40px 40px, 10px 10px, 10px 10px',
        position: 'relative'
      }}
    >
      <Container size="xl" py={20}>
        <Stack gap="md">
          {/* Top Navigation */}
          <Group justify="flex-start" mb="sm">
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => navigate('/')}
              size="lg"
            >
              <IconArrowLeft size={20} />
            </ActionIcon>
          </Group>

          {/* Compact Authentication Panel */}
          <AdobeAuthPanel onAuthStatusChange={handleAuthStatusChange} />

          {/* Show sections only when authenticated */}
          {authStatus.isAuthenticated && (
            <>
              {/* Flexible Discounts Management */}
              <ScrollArea>
                <FlexibleDiscounts 
                  expanded={flexDiscountsExpanded}
                  onToggle={() => setFlexDiscountsExpanded(!flexDiscountsExpanded)}
                />
              </ScrollArea>

              {/* Price Lists Management */}
              <ScrollArea style={{ display: 'none' }}>
                <PriceLists 
                  expanded={priceListsExpanded}
                  onToggle={() => setPriceListsExpanded(!priceListsExpanded)}
                />
              </ScrollArea>

              {/* Adobe Recommendations Management */}
              <ScrollArea style={{ display: 'none' }}>
                <AdobeRecommendations 
                  expanded={recommendationsExpanded}
                  onToggle={() => setRecommendationsExpanded(!recommendationsExpanded)}
                />
              </ScrollArea>
            </>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default AdobeNewFunctionalitiesFlow; 