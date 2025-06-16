import React from 'react';
import { Paper, Title, Text, Group, Box, SimpleGrid, Button, Anchor, Divider, Stack } from '@mantine/core';
import { IconDots } from '@tabler/icons-react';
import LinkedMembershipPage from './LinkedMembershipPage';

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

const CustomerInfo = () => (
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
        <Text fw={500}>-</Text>
      </Box>
      <Box>
        <Text size="xs" c="dimmed">Current discount levels - consumables</Text>
        <Text fw={500}>-</Text>
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
            <Text>2132423435</Text>
        </Box>
      </SimpleGrid>
     </Paper>
  </Paper>
);

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
    </Box>
  );
};

export default CustomerDetailsPage; 