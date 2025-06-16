import React from 'react';
import { NavLink, Stack, Title } from '@mantine/core';

const navLinks = [
  { label: 'Opportunities' },
  { label: 'Bulk Creation' },
  { label: 'Reviews & Questions' },
  { type: 'billing', label: 'BILLING' },
  { label: 'Orders' },
  { label: 'Invoices' },
  { label: 'Payments' },
  { label: 'Quotes' },
  { label: 'Metered Usage' },
  { type: 'events', label: 'EVENTS' },
  { label: 'Event Logs' },
  { label: 'App Usage Logs' },
  { label: 'Admin Logs', active: true },
];

const DummySidebar = () => {
  return (
    <Stack>
      {navLinks.map((link) => {
        if (link.type) {
          return (
            <Title order={6} c="dimmed" mt="md" mb="xs" key={link.label}>
              {link.label}
            </Title>
          );
        }
        return (
          <NavLink
            key={link.label}
            href="#"
            label={link.label}
            active={link.active}
            variant="filled"
          />
        );
      })}
    </Stack>
  );
};

export default DummySidebar; 