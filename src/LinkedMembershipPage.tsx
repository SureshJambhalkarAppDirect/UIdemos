import React, { useState } from 'react';
import {
  Box,
  Title,
  SegmentedControl,
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
} from '@mantine/core';
import { IconInfoCircle, IconCheck, IconX } from '@tabler/icons-react';

// Mock data for search results
const mockSearchResults = [
  {
    id: '1',
    name: 'Federal Government Purchasing Group',
    type: 'Standard',
    creationDate: '06/16/25',
    country: 'US',
  },
  {
    id: '2',
    name: 'State of California Consolidated Agencies',
    type: 'Consortium',
    creationDate: '06/23/25',
    country: 'US',
  },
  {
    id: '3',
    name: 'Healthcare Partners Network',
    type: 'Standard',
    creationDate: '06/08/25',
    country: 'US',
  },
  {
    id: '4',
    name: 'Non-Profit Organizations Alliance',
    type: 'Consortium',
    creationDate: '06/12/25',
    country: 'US',
  },
  {
    id: '5',
    name: 'Municipal Government Group',
    type: 'Standard',
    creationDate: '06/29/25',
    country: 'US',
  },
  {
    id: '6',
    name: 'Educational Institutions Consortium',
    type: 'Consortium',
    creationDate: '06/05/25',
    country: 'US',
  },
  {
    id: '7',
    name: 'Technology Services Alliance',
    type: 'Standard',
    creationDate: '06/18/25',
    country: 'US',
  },
  {
    id: '8',
    name: 'Regional Transportation Consortium',
    type: 'Consortium',
    creationDate: '06/14/25',
    country: 'US',
  },
];

const LinkedMembershipPage = () => {
  const [mode, setMode] = useState('join');
  const [searchTerm, setSearchTerm] = useState('');
  const [newLMName, setNewLMName] = useState('');
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

  // If enrolled, show read-only state
  if (isEnrolled && enrolledLM) {
    return (
      <Box>
        <Group justify="space-between" align="center" mb="md">
          <Title order={4}>Linked Membership</Title>
          <Anchor href="#" size="sm">Find out more</Anchor>
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
        <Title order={4}>Linked Membership</Title>
        <Anchor href="#" size="sm">Find out more</Anchor>
      </Group>

      <SegmentedControl
        value={mode}
        onChange={setMode}
        data={[
          { label: 'Join Existing', value: 'join' },
          { label: 'Create New', value: 'create' },
        ]}
        fullWidth
        mb="lg"
      />

      {mode === 'join' && (
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
                          LM type: {lm.type} | Creation Date: {lm.creationDate}
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
      )}

      {mode === 'create' && (
        <Stack gap="md">
          <Alert icon={<IconInfoCircle size="1rem" />} color="green" variant="light">
            Creating new Linked Membership for {companyCountry}
          </Alert>
          
          <Group gap="md">
            <TextInput
              placeholder="Enter a name for the new Linked Membership"
              value={newLMName}
              onChange={(e) => setNewLMName(e.target.value)}
              style={{ flex: 1 }}
            />
            <Button 
              disabled={!newLMName.trim()}
            >
              Create
            </Button>
          </Group>
        </Stack>
      )}
    </Box>
  );
};

export default LinkedMembershipPage; 