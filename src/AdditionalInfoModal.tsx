import React, { useState } from 'react';
import { Modal, Stack, TextInput, Select, Group, Button, Text, Tooltip, ActionIcon, Radio } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

interface MockData {
  anniversaryDate: string;
  hasLinkedMembership: boolean;
  has3YCCommitment: boolean;
  renewalQuantity: number;
  defaultMarketSegment?: string;
  defaultMarketSubSegment?: string;
  defaultCountry?: string;
}

interface AdditionalInfoModalProps {
  opened: boolean;
  onClose: () => void;
  mockData?: MockData;
  scenario?: string;
}

const AdditionalInfoModal = ({ opened, onClose, mockData, scenario }: AdditionalInfoModalProps) => {
  // Use provided mock data or defaults
  const defaultMockData: MockData = {
    anniversaryDate: '2025-02-15',
    hasLinkedMembership: false,
    has3YCCommitment: false,
    renewalQuantity: 150,
    defaultMarketSegment: 'Government',
    defaultMarketSubSegment: 'Federal',
    defaultCountry: 'United States'
  };

  const currentMockData = { ...defaultMockData, ...mockData };

  const [address, setAddress] = useState('50 GROVE ST.');
  const [city, setCity] = useState('Somerville');
  const [country, setCountry] = useState(currentMockData.defaultCountry || 'United States');
  const [state, setState] = useState('Massachusetts');
  const [zipCode, setZipCode] = useState('02114');
  const [marketSegment, setMarketSegment] = useState(currentMockData.defaultMarketSegment || 'Government');
  const [preferredLanguage, setPreferredLanguage] = useState('English (US)');
  const [reseller, setReseller] = useState('Default (P1000030597)');
  const [marketSubSegment, setMarketSubSegment] = useState(currentMockData.defaultMarketSubSegment || 'Federal');
  const [convertToLGA, setConvertToLGA] = useState('');

  // Helper function to check if customer is in AD-30 window
  const isInAnniversaryWindow = () => {
    const today = new Date();
    const anniversary = new Date(currentMockData.anniversaryDate);
    const daysDiff = Math.ceil((anniversary.getTime() - today.getTime()) / (1000 * 3600 * 24));
    // Customer should be within 30 days BEFORE their anniversary (0 to 30 days until anniversary)
    return daysDiff >= 0 && daysDiff <= 30;
  };

  // Check if LGA conversion field should be visible
  const shouldShowLGAConversion = () => {
    return (
      isInAnniversaryWindow() && // In AD-30 window
      !currentMockData.hasLinkedMembership && // Not part of active Linked Memberships
      !currentMockData.has3YCCommitment && // Not committed to 3YC
      marketSegment === 'Government' && // Market segment is GOV
      marketSubSegment !== '' && // Market sub segment is selected
      (country === 'United States' || country === 'Canada') && // Country is US or Canada
      currentMockData.renewalQuantity > 100 // Renewal quantity >100
    );
  };

  const lgaTooltipContent = (
    <div style={{ maxWidth: '300px' }}>
      <Text size="xs" fw={600} mb="xs">Field visible when ALL conditions are met:</Text>
      <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', lineHeight: '1.4' }}>
        <li>Customer is in the window (Anniversary date –30)</li>
        <li>Customer is not part of any active Linked Memberships</li>
        <li>Customer is not applied for or committed to Three-Year Commits (3YC)</li>
        <li>Market segment is Government</li>
        <li>Market Sub Segment is selected</li>
        <li>Country is US or Canada</li>
        <li>Customer's renewal quantity is &gt;100</li>
      </ul>
      <Text size="xs" c="dimmed" mt="xs">
        Current status: {shouldShowLGAConversion() ? '✅ All conditions met' : '❌ Conditions not met'}
      </Text>
    </div>
  );

  const modalTitle = scenario ? `Additional Information - ${scenario}` : 'Additional Information';

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={modalTitle}
      size="md"
      styles={{
        title: { fontWeight: 600 },
      }}
    >
      <Stack gap="sm">
        <TextInput
          label="Address"
          value={address}
          onChange={(event) => setAddress(event.currentTarget.value)}
          required
          withAsterisk
          size="xs"
        />
        <TextInput
          label="City"
          value={city}
          onChange={(event) => setCity(event.currentTarget.value)}
          required
          withAsterisk
          size="xs"
        />
        <Select
          label="Country"
          value={country}
          onChange={(value) => setCountry(value || '')}
          data={['United States', 'Canada', 'Mexico']}
          required
          withAsterisk
          size="xs"
        />
        <Select
          label="State"
          value={state}
          onChange={(value) => setState(value || '')}
          data={['Massachusetts', 'California', 'New York']}
          required
          withAsterisk
          size="xs"
        />
        <TextInput
          label="Zip code"
          value={zipCode}
          onChange={(event) => setZipCode(event.currentTarget.value)}
          required
          withAsterisk
          size="xs"
        />
        <Select
          label="Market segment"
          value={marketSegment}
          onChange={(value) => setMarketSegment(value || '')}
          data={['Government', 'Commercial', 'Education']}
          required
          withAsterisk
          size="xs"
        />
        {marketSegment === 'Government' && (country === 'United States' || country === 'Canada') && (
          <div>
            <Group gap="xs" mb="xs">
              <Text size="xs" fw={500}>
                Market Sub Segment
              </Text>
              <Tooltip 
                label={
                  <div style={{ maxWidth: '250px' }}>
                    <Text size="xs" fw={600} mb="xs">Field visible when ALL conditions are met:</Text>
                    <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', lineHeight: '1.4' }}>
                      <li>Market segment is Government</li>
                      <li>Country is US or Canada</li>
                    </ul>
                    <Text size="xs" c="dimmed" mt="xs">
                      Current status: {marketSegment === 'Government' && (country === 'United States' || country === 'Canada') ? '✅ All conditions met' : '❌ Conditions not met'}
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
            <Select
              value={marketSubSegment}
              onChange={(value) => setMarketSubSegment(value || '')}
              data={['Federal', 'State']}
              size="xs"
            />
          </div>
        )}
        
        {shouldShowLGAConversion() && (
          <div>
            <Group gap="xs" mb="xs">
              <Text size="xs" fw={500}>
                Convert to LGA from the next term?
              </Text>
              <Tooltip 
                label={lgaTooltipContent}
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
            <Radio.Group
              value={convertToLGA}
              onChange={setConvertToLGA}
              size="xs"
            >
              <Group gap="md">
                <Radio value="yes" label="Yes" />
                <Radio value="no" label="No" />
              </Group>
            </Radio.Group>
          </div>
        )}

        <Select
          label="Preferred language"
          value={preferredLanguage}
          onChange={(value) => setPreferredLanguage(value || '')}
          data={['English (US)', 'Spanish (Mexico)']}
          required
          withAsterisk
          size="xs"
        />
        <Select
          label="Reseller"
          value={reseller}
          onChange={(value) => setReseller(value || '')}
          data={['Default (P1000030597)', 'Reseller B']}
          required
          withAsterisk
          size="xs"
        />

        {/* Debug info for napkin drawing */}
        <div style={{ backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '4px', marginTop: '8px' }}>
          <Text size="xs" c="dimmed" fw={600} mb="4px">Mock Data Scenario {scenario ? `(${scenario})` : ''}:</Text>
          <Text size="xs" c="dimmed">Anniversary: {currentMockData.anniversaryDate} | Days to AD: {Math.ceil((new Date(currentMockData.anniversaryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))}</Text>
          <Text size="xs" c="dimmed">Linked Membership: {currentMockData.hasLinkedMembership ? 'Yes' : 'No'} | 3YC Status: {currentMockData.has3YCCommitment ? 'Yes' : 'No'}</Text>
          <Text size="xs" c="dimmed">Renewal Quantity: {currentMockData.renewalQuantity} | LGA Field Visible: {shouldShowLGAConversion() ? 'Yes' : 'No'}</Text>
        </div>

        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onClose} size="sm">
            Cancel
          </Button>
          <Button onClick={onClose} size="sm">Save Details</Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default AdditionalInfoModal; 