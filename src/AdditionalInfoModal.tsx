import React, { useState } from 'react';
import { Modal, Stack, TextInput, Select, Group, Button, Text } from '@mantine/core';

interface AdditionalInfoModalProps {
  opened: boolean;
  onClose: () => void;
}

const AdditionalInfoModal = ({ opened, onClose }: AdditionalInfoModalProps) => {
  const [address, setAddress] = useState('50 GROVE ST.');
  const [city, setCity] = useState('Somerville');
  const [country, setCountry] = useState('United States');
  const [state, setState] = useState('Massachusetts');
  const [zipCode, setZipCode] = useState('02114');
  const [marketSegment, setMarketSegment] = useState('Government');
  const [preferredLanguage, setPreferredLanguage] = useState('English (US)');
  const [reseller, setReseller] = useState('Default (P1000030597)');
  const [marketSubSegment, setMarketSubSegment] = useState('');

  const isSubSegmentRequired = marketSegment === 'Government';

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Additional Information"
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
        {isSubSegmentRequired && (
          <Select
            label="Market Sub Segment"
            value={marketSubSegment}
            onChange={(value) => setMarketSubSegment(value || '')}
            data={['Federal', 'State']}
            required={isSubSegmentRequired}
            withAsterisk
            size="xs"
          />
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