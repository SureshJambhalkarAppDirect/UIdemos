import React from 'react';
import { Paper, Title, Text, Group, Box, SimpleGrid, Button, Anchor, Divider, Stack, Center, ActionIcon } from '@mantine/core';
import { IconDots } from '@tabler/icons-react';
import LinkedMembershipPage from './LinkedMembershipPage';
import { useLocation } from 'react-router-dom';

const CustomerHeader = () => (
  <Paper withBorder p="lg" radius="md">
    <Group justify="space-between">
      <Group>
        <Box bg="red" p="sm" style={{ borderRadius: '4px' }}>
          <Text c="white" fw={700} size="xl">A</Text>
        </Box>
        <Box>
          <Text fw={700} size="lg">Cypress Cormier - Fay</Text>
          <Text size="xs" c="dimmed">P1005214392</Text>
        </Box>
      </Group>
      <IconDots />
    </Group>
  </Paper>
);

const CustomerInfo = () => {
  const location = useLocation();
  const [isCreateFlow, setIsCreateFlow] = React.useState(false);
  
  React.useEffect(() => {
    const storageKey = 'lastFlowWasCreate';
    
    // First check for direct info in state
    if (location.state?.isCreateFlow !== undefined) {
      setIsCreateFlow(location.state.isCreateFlow);
      return;
    }
    
    // Next check URL patterns directly
    if (location.pathname.includes('/create-and-convert')) {
      setIsCreateFlow(true);
      return;
    }
    
    // If location state has path info, use it
    if (location.state?.fromPath) {
      const isCreate = location.state.fromPath.includes('create-and-convert');
      setIsCreateFlow(isCreate);
      return;
    }
    
    // If direct tab navigation (Full Page button), check localStorage
    if (location.pathname.endsWith('/customer-details')) {
      const lastWasCreate = localStorage.getItem(storageKey) === 'true';
      setIsCreateFlow(lastWasCreate);
      return;
    }
    
    // Default to false
    setIsCreateFlow(false);
  }, [location]);
  
  // Force the correct label based on the current tab
  const label = isCreateFlow ? 'LGA customer?' : 'Convert to LGA from the next term?';
  
  return (
    <Paper withBorder p="lg" radius="md" mt="md">
      <Text fw={500}>Cypress Cormier - Fay</Text>
      <Text size="sm">adsasd asdasd</Text>
      <Text size="sm">50 GROVE ST.</Text>
      <Text size="sm">Somerville, MA 02114</Text>
      <Text size="sm">US</Text>
      <Divider my="lg" />
      <SimpleGrid cols={2} verticalSpacing="lg">
        <Box>
          <Text size="xs" c="dimmed">Current discount levels - licenses</Text>
          <Text fw={500}>Level 01</Text>
        </Box>
        <Box>
          <Text size="xs" c="dimmed">Current discount levels - consumables</Text>
          <Text fw={500}>Tier T1</Text>
        </Box>
        <Box>
          <Text size="xs" c="dimmed">Preferred language</Text>
          <Text fw={500}>English (US)</Text>
        </Box>
        <Box>
          <Text size="xs" c="dimmed">Market segment</Text>
          <Text fw={500}>Government</Text>
        </Box>
        <Box>
          <Text size="xs" c="dimmed">Anniversary date</Text>
          <Text fw={500}>-</Text>
        </Box>
        <Box>
          <Text size="xs" c="dimmed">Global customer</Text>
          <Text fw={500}>No</Text>
        </Box>
        <Box>
          <Text size="xs" c="dimmed" style={{
            backgroundColor: '#fff3cd', 
            padding: '2px 6px', 
            borderRadius: '3px', 
            border: '1px solid #ffeaa7',
            fontWeight: 600,
            color: '#856404',
            display: 'inline-block'
          }}>Market subsegment</Text>
          <Text fw={500}>Federal</Text>
        </Box>
        <Box>
          <Text size="xs" c="dimmed" style={{
            backgroundColor: '#fff3cd', 
            padding: '2px 6px', 
            borderRadius: '3px', 
            border: '1px solid #ffeaa7',
            fontWeight: 600,
            color: '#856404',
            display: 'inline-block'
          }}>{label}</Text>
          <Text fw={500}>Yes</Text>
        </Box>
      </SimpleGrid>
      <Paper withBorder p="md" radius="sm" mt="lg" style={{backgroundColor: '#F8F9FA'}}>
        <SimpleGrid cols={3}>
          <Box>
              <Text size="xs" fw={700}>Administrator name</Text>
              <Text>adsasd asdasd</Text>
          </Box>
          <Box>
              <Text size="xs" fw={700}>Email ID</Text>
              <Text>asdasd@as.com</Text>
          </Box>
          <Box>
              <Text size="xs" fw={700}>Phone number</Text>
              <Text>2132423456</Text>
          </Box>
        </SimpleGrid>
      </Paper>
    </Paper>
  );
};

const ProgramCard = ({ title, findOutMore, children, ctaText }: { title: string, findOutMore?: boolean, ctaText: string, children: React.ReactNode }) => (
    <Paper withBorder p="lg" radius="md" style={{ height: '220px' }}>
        <Stack justify="space-between" h="100%">
            <Box style={{textAlign: 'center'}}>
                <Title order={4}>{title}</Title>
                {findOutMore && <Anchor href="#" size="sm">Find out more</Anchor>}
            </Box>
            <Box style={{textAlign: 'center'}}>{children}</Box>
            <Button variant="outline" color="gray">{ctaText}</Button>
        </Stack>
    </Paper>
);

const AppDirectFooter = () => (
  <Box
    style={{
      backgroundColor: '#F5F5F5',
      borderTop: '1px solid #E5E5E5',
      marginTop: '3rem',
      padding: '1rem 0'
    }}
  >
    <Center>
      <Group justify="space-between" style={{ width: '100%', maxWidth: '1200px', padding: '0 2rem' }}>
        <Group>
          <Group gap="xs">
            <Box
              style={{
                width: 24,
                height: 24,
                backgroundColor: '#000',
                clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
                transform: 'rotate(0deg)'
              }}
            />
            <Text size="sm" fw={500}>
              Powered by{' '}
              <Text component="span" fw={700}>
                AppDirect
              </Text>
            </Text>
          </Group>
        </Group>
        
        <Group gap="lg" style={{ flex: 1, justifyContent: 'center' }}>
          <Text size="sm" c="dimmed">© 2025 AppDistribution</Text>
          <Anchor href="#" size="sm" c="dimmed">Contact</Anchor>
          <Anchor href="#" size="sm" c="dimmed">Help Center</Anchor>
          <Anchor href="#" size="sm" c="dimmed">Privacy Policy</Anchor>
          <Anchor href="#" size="sm" c="dimmed">Terms & Conditions</Anchor>
        </Group>
        
        <Group>
          <Text size="sm" c="dimmed">English (United States)</Text>
          <ActionIcon variant="subtle" size="sm">
            <IconDots size={16} />
          </ActionIcon>
        </Group>
      </Group>
    </Center>
  </Box>
);

const CustomerDetailsPage = () => {
  return (
    <Box>
        <CustomerHeader />
        <CustomerInfo />
        <Title order={3} my="xl">Value Incentive Plan (VIP) Programs</Title>
        <SimpleGrid cols={2} spacing="xl">
            <ProgramCard title="3-Year Commit (3YC)" ctaText="Apply for 3YC" findOutMore>
                <Box />
            </ProgramCard>
            <ProgramCard title="High Growth Offers (HGO)" ctaText="Check Eligible Offers" findOutMore>
                 <Text size="xs" c="dimmed">3YC is required before making a purchase.</Text>
            </ProgramCard>
            <Box style={{gridColumn: '1 / span 2'}} mt="xl">
                <LinkedMembershipPage/>
            </Box>
        </SimpleGrid>
        <AppDirectFooter />
    </Box>
  );
};

export default CustomerDetailsPage; 