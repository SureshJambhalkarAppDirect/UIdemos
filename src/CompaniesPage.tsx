import React, { useState } from 'react';
import { 
  Paper, 
  Title, 
  Text, 
  Group, 
  Box, 
  Button, 
  Table, 
  Badge, 
  Pagination,
  ActionIcon,
  TextInput,
  Breadcrumbs,
  Anchor,
  Indicator
} from '@mantine/core';
import { IconSearch, IconFilter, IconDownload, IconChevronRight } from '@tabler/icons-react';

interface CompaniesPageProps {
  onSelectCompany: (companyId: string) => void;
}

const CompaniesPage = ({ onSelectCompany }: CompaniesPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock companies data
  const companies = [
    {
      id: '1',
      name: 'Cypress Cormier - Fay',
      status: 'Enabled',
      users: 15,
      products: 3,
      lastLogin: '2025-01-15',
      type: 'Premium'
    },
    {
      id: '2', 
      name: 'TechCorp Solutions',
      status: 'Enabled',
      users: 45,
      products: 8,
      lastLogin: '2025-01-14',
      type: 'Enterprise'
    },
    {
      id: '3',
      name: 'Digital Innovations LLC',
      status: 'Disabled',
      users: 23,
      products: 5,
      lastLogin: '2025-01-10',
      type: 'Standard'
    },
    {
      id: '4',
      name: 'Global Systems Inc',
      status: 'Enabled',
      users: 67,
      products: 12,
      lastLogin: '2025-01-16',
      type: 'Enterprise'
    },
    {
      id: '5',
      name: 'Alpha Beta Technologies',
      status: 'Enabled',
      users: 31,
      products: 6,
      lastLogin: '2025-01-13',
      type: 'Premium'
    }
  ];

  const breadcrumbItems = [
    { title: 'Home', href: '#' },
    { title: 'Companies', href: '#' }
  ].map((item, index) => (
    <Anchor href={item.href} key={index} size="sm" c="#0891b2">
      {item.title}
    </Anchor>
  ));

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<IconChevronRight size={14} />} mb="lg">
        {breadcrumbItems}
      </Breadcrumbs>

      {/* Page Header */}
      <Group justify="space-between" mb="xl">
        <Title order={2} c="#374151" fw={600} size="24px">
          Companies
        </Title>
        <Group>
          <Button variant="outline" color="gray" leftSection={<IconFilter size={16} />}>
            Show Filters
          </Button>
          <Button variant="outline" color="gray" leftSection={<IconDownload size={16} />}>
            Download Report
          </Button>
        </Group>
      </Group>

      {/* Search and Filters */}
      <Group mb="lg">
        <TextInput
          placeholder="Search companies..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.currentTarget.value)}
          leftSection={<IconSearch size={16} />}
          style={{ flex: 1, maxWidth: 300 }}
        />
      </Group>

      {/* Companies Table */}
      <Paper withBorder radius="md" bg="white">
        <Table striped highlightOnHover>
          <Table.Thead bg="#f9fafb">
            <Table.Tr>
              <Table.Th fw={600} c="#374151">Status</Table.Th>
              <Table.Th fw={600} c="#374151">Company Name</Table.Th>
              <Table.Th fw={600} c="#374151">Users</Table.Th>
              <Table.Th fw={600} c="#374151">Products</Table.Th>
              <Table.Th fw={600} c="#374151">Last Login</Table.Th>
              <Table.Th fw={600} c="#374151">Type</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {companies
              .filter(company => 
                company.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((company) => (
                <Table.Tr 
                  key={company.id}
                  style={{ 
                    cursor: 'pointer',
                    height: '48px'
                  }}
                  onClick={() => onSelectCompany(company.id)}
                >
                  <Table.Td>
                    <Group gap="xs">
                      <Indicator 
                        color={company.status === 'Enabled' ? '#22c55e' : '#ef4444'} 
                        size={8}
                      />
                      <Text size="sm" c="#374151">{company.status}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={500} c="#374151">{company.name}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="#374151">{company.users}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="#374151">{company.products}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="#6b7280">{company.lastLogin}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge 
                      color={company.type === 'Enterprise' ? 'blue' : company.type === 'Premium' ? 'teal' : 'gray'}
                      variant="light"
                      size="sm"
                    >
                      {company.type}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
        </Table>

        {/* Pagination */}
        <Group justify="center" p="md">
          <Pagination 
            total={10} 
            color="#0891b2"
            size="sm"
          />
        </Group>
      </Paper>
    </Box>
  );
};

export default CompaniesPage; 