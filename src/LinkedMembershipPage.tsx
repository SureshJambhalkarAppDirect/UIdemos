import React, { useState } from 'react';
import {
  Box,
  Title,
  Tabs,
  TextInput,
  Button,
  Text,
  Anchor,
  Stack,
  Group,
  Alert,
  Paper,
  SimpleGrid,
  Pagination,
  Notification,
  Select,
  Tooltip,
  ActionIcon,
} from '@mantine/core';
import { IconInfoCircle, IconCheck, IconX } from '@tabler/icons-react';

// Mock data for search results
const mockSearchResults = [
  {
    id: '1',
    lmId: '10923232',
    name: 'Federal Government Purchasing Group',
    type: 'Standard',
    creationDate: '06/16/25',
    country: 'US',
  },
  {
    id: '2',
    lmId: '10923456',
    name: 'State of California Consolidated Agencies',
    type: 'Consortium',
    creationDate: '06/23/25',
    country: 'US',
  },
  {
    id: '3',
    lmId: '10924578',
    name: 'Healthcare Partners Network',
    type: 'Standard',
    creationDate: '06/08/25',
    country: 'US',
  },
  {
    id: '4',
    lmId: '10925689',
    name: 'Non-Profit Organizations Alliance',
    type: 'Consortium',
    creationDate: '06/12/25',
    country: 'US',
  },
  {
    id: '5',
    lmId: '10926790',
    name: 'Municipal Government Group',
    type: 'Standard',
    creationDate: '06/29/25',
    country: 'US',
  },
  {
    id: '6',
    lmId: '10927801',
    name: 'Educational Institutions Consortium',
    type: 'Consortium',
    creationDate: '06/05/25',
    country: 'US',
  },
  {
    id: '7',
    lmId: '10928912',
    name: 'Technology Services Alliance',
    type: 'Standard',
    creationDate: '06/18/25',
    country: 'US',
  },
  {
    id: '8',
    lmId: '10929023',
    name: 'Regional Transportation Consortium',
    type: 'Consortium',
    creationDate: '06/14/25',
    country: 'US',
  },
];

const LinkedMembershipPage = () => {
  const [mode, setMode] = useState('join');
  const [searchTerm, setSearchTerm] = useState('');
  const [newLMName, setNewLMName] = useState('Federal Government Purchasing Group');
  const [newLMType, setNewLMType] = useState('Standard');
  const [searchResults, setSearchResults] = useState<typeof mockSearchResults>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchError, setSearchError] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolledLM, setEnrolledLM] = useState<typeof mockSearchResults[0] | null>(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  
  // Get country from company profile (in real app, this would come from props or context)
  const companyCountry = 'US'; // This would be extracted from the company profile
  const resultsPerPage = 5;

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    // Validate minimum 3 characters
    if (searchTerm.trim().length < 3) {
      setSearchError('Please enter at least 3 characters to search');
      setSearchResults([]);
      setHasSearched(false);
      return;
    }
    
    // Clear any previous errors
    setSearchError('');
    
    // Simulate API call with country from profile
    const filteredResults = mockSearchResults.filter(lm =>
      lm.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      lm.country === companyCountry
    );
    
    setSearchResults(filteredResults);
    setHasSearched(true);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(searchResults.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentResults = searchResults.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEnroll = (lm: typeof mockSearchResults[0]) => {
    setEnrolledLM(lm);
    setIsEnrolled(true);
    setShowSuccessBanner(true);
    
    // Auto-dismiss banner after 5 seconds
    setTimeout(() => {
      setShowSuccessBanner(false);
    }, 5000);
  };

  const handleCloseBanner = () => {
    setShowSuccessBanner(false);
  };

  const handleCreateNew = () => {
    // Handle create new logic here
    console.log('Creating new LM:', { name: newLMName, type: newLMType });
  };

  const handleCancel = () => {
    // Reset form or handle cancel logic
    setNewLMName('');
    setNewLMType('Standard');
  };

  // If enrolled, show read-only state
  if (isEnrolled && enrolledLM) {
    return (
      <Box>
        <Group justify="space-between" align="center" mb="md">
          <Title order={4}>Linked Membership</Title>
        </Group>

        {showSuccessBanner && (
          <Notification
            icon={<IconCheck size="1.1rem" />}
            color="green"
            title="Success"
            onClose={handleCloseBanner}
            mb="lg"
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 1000,
              minWidth: '400px'
            }}
          >
            Customer Successfully enrolled in the Linked Membership
          </Notification>
        )}

        <Paper withBorder p="lg" radius="md">
          <SimpleGrid cols={2} spacing="lg">
            <Box>
              <Text size="sm" c="dimmed" mb={4}>Linked Membership ID</Text>
              <Text fw={500}>{enrolledLM.lmId}</Text>
            </Box>
            <Box>
              <Text size="sm" c="dimmed" mb={4}>Linked Membership name</Text>
              <Text fw={500}>{enrolledLM.name}</Text>
            </Box>
            <Box>
              <Text size="sm" c="dimmed" mb={4}>Linked Membership type</Text>
              <Text fw={500}>{enrolledLM.type}</Text>
            </Box>
            <Box>
              <Text size="sm" c="dimmed" mb={4}>Creation date</Text>
              <Text fw={500}>{enrolledLM.creationDate}</Text>
            </Box>
            <Box>
              <Text size="sm" c="dimmed" mb={4}>Owner</Text>
              <Text fw={500}>No</Text>
            </Box>
          </SimpleGrid>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Group justify="space-between" align="center" mb="md">
        <Group gap="xs">
          <Title order={4} style={{
            backgroundColor: '#fff3cd', 
            padding: '4px 8px', 
            borderRadius: '3px', 
            border: '1px solid #ffeaa7',
            color: '#856404',
            display: 'inline-block'
          }}>Linked Membership</Title>
          <Tooltip 
            label={
              <div style={{ maxWidth: '300px' }}>
                <Text size="xs" fw={600} mb="xs">Join Existing tab visible when ALL conditions are met:</Text>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', lineHeight: '1.4' }}>
                  <li>Market Segment is Government</li>
                  <li>Market Subsegment has a selection (Federal or State)</li>
                  <li>Country is US or Canada under Company Profile</li>
                </ul>
                <Text size="xs" c="dimmed" mt="xs">
                  Current status: ✅ All conditions met
                </Text>
              </div>
            }
            multiline
            position="top"
            withArrow
            styles={{
              tooltip: { backgroundColor: '#333', color: 'white', fontSize: '11px' }
            }}
          >
            <ActionIcon variant="subtle" size="sm" color="gray">
              <IconInfoCircle size={14} />
            </ActionIcon>
          </Tooltip>
        </Group>
        <Anchor href="#" size="sm">Find out more</Anchor>
      </Group>

      <Tabs value={mode} onChange={(value) => setMode(value || 'join')} mb="lg" color="#0891b2">
        <Tabs.List>
          <Tabs.Tab value="join">Join Existing</Tabs.Tab>
          <Tabs.Tab value="create">Create New</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="join" pt="md">
          <Stack gap="md">
            <Group gap="md">
              <TextInput
                placeholder="Enter a name to search (minimum 3 characters)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{ flex: 1 }}
                error={searchError}
              />
              <Button 
                onClick={handleSearch}
                disabled={!searchTerm.trim()}
              >
                Search
              </Button>
            </Group>

            {searchError && (
              <Alert color="red" variant="light" mt="md">
                {searchError}
              </Alert>
            )}

            {hasSearched && (
              <Box mt="md">
                {searchResults.length > 0 ? (
                  <Stack gap="md">
                    <Text size="sm" c="dimmed">
                      {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                    </Text>
                    <SimpleGrid cols={1} spacing="md">
                      {currentResults.map((lm) => (
                        <Paper key={lm.id} withBorder p="md" radius="md">
                          <Group justify="space-between" align="flex-start" mb="xs">
                            <Text fw={600} size="md">{lm.name}</Text>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEnroll(lm)}
                            >
                              Enroll
                            </Button>
                          </Group>
                          <Text size="sm" c="dimmed">
                            ID: {lm.lmId} | Type: {lm.type} | Creation Date: {lm.creationDate}
                          </Text>
                        </Paper>
                      ))}
                    </SimpleGrid>
                    {totalPages > 1 && (
                      <Group justify="center" mt="md">
                        <Pagination
                          value={currentPage}
                          onChange={handlePageChange}
                          total={totalPages}
                          size="sm"
                        />
                      </Group>
                    )}
                  </Stack>
                ) : (
                  <Text c="dimmed" ta="center" py="xl">
                    No Linked Memberships found for "{searchTerm}" in {companyCountry}
                  </Text>
                )}
              </Box>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="create" pt="md">
          <Paper withBorder p="lg" radius="md">
            <Stack gap="lg">
              <Alert 
                icon={<IconInfoCircle size="1rem" />} 
                color="blue" 
                variant="light"
                styles={{
                  root: {
                    backgroundColor: '#E3F2FD',
                    border: '1px solid #BBDEFB'
                  }
                }}
              >
                <Text size="sm">
                  Adobe customer can participate in only one VIP program at a time. Switch to{' '}
                  <Anchor href="#" size="sm" style={{ color: '#1976D2' }}>
                    3-Year Commit
                  </Anchor>
                  .
                </Text>
              </Alert>

              <Box>
                <Text size="sm" fw={500} mb="xs">
                  <Text component="span" c="red">*</Text> Linked Membership name
                </Text>
                <TextInput
                  value={newLMName}
                  onChange={(e) => setNewLMName(e.target.value)}
                  placeholder="Enter membership name"
                  size="sm"
                  styles={{
                    input: {
                      backgroundColor: '#F5F5F5',
                      border: '1px solid #E0E0E0'
                    }
                  }}
                />
                <Text size="xs" c="dimmed" mt="xs">
                  Identifies your organization's membership in Adobe's Value Incentive Plan (VIP). This name is typically the name of your organization.
                </Text>
              </Box>

              <Box>
                <Text size="sm" fw={500} mb="xs">
                  <Text component="span" c="red">*</Text> Linked Membership type
                </Text>
                <Select
                  value={newLMType}
                  onChange={(value) => setNewLMType(value || 'Standard')}
                  data={[
                    { value: 'Standard', label: 'Standard' },
                    { value: 'Consortium', label: 'Consortium' }
                  ]}
                  placeholder="Select membership type"
                  size="sm"
                  styles={{
                    input: {
                      backgroundColor: '#F5F5F5',
                      border: '1px solid #E0E0E0'
                    }
                  }}
                />
                <Text size="xs" c="dimmed" mt="xs">
                  Select the type of membership
                </Text>
              </Box>

              <Group gap="md" mt="lg">
                <Button 
                  onClick={handleCreateNew}
                  disabled={!newLMName.trim()}
                  style={{
                    backgroundColor: '#4FC3F7',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#29B6F6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#4FC3F7';
                  }}
                >
                  Apply Linked Membership
                </Button>
                <Button 
                  variant="subtle"
                  color="gray"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Group>
            </Stack>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
};

export default LinkedMembershipPage; 