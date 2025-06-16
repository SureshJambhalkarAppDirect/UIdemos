import React from 'react';
import { Box, Container, Title, Text, Group, Card, Button, Stack, Grid } from '@mantine/core';

interface LandingPageProps {
  onNavigateToDemo: (demo: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToDemo }) => {
  const napkins = [
    {
      id: 'modal',
      demo: 'Demo 1: Modal',
      color: '#0629D3' // Royal blue from the palette
    },
    {
      id: 'lm',
      demo: 'Demo 2: LM Flow',
      color: '#014929' // Forest green from the palette
    },
    {
      id: 'customerDetails',
      demo: 'Demo 3: Full Page',
      color: '#5326A5' // Purple from the palette
    }
  ];

  const NapkinCard = ({ napkin, index }: { napkin: typeof napkins[0]; index: number }) => {
    return (
      <Card
        shadow="sm"
        padding="xl"
        radius="md"
        withBorder
        style={{
          border: `1px dashed ${napkin.color}`,
          backgroundColor: '#FAFAFA',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          animationDelay: `${index * 0.1}s`,
          opacity: 0,
          animation: 'slideInUp 0.6s ease-out forwards',
          animationFillMode: 'both'
        }}
        onClick={() => onNavigateToDemo(napkin.id)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px) rotate(0.5deg)';
          e.currentTarget.style.boxShadow = `0 8px 25px ${napkin.color}20`;
          e.currentTarget.style.backgroundColor = '#FFFFFF';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) rotate(0deg)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.backgroundColor = '#FAFAFA';
        }}
      >
        {/* Sketchy corner decoration */}
        <Box
          style={{
            position: 'absolute',
            top: -5,
            right: -5,
            width: 30,
            height: 30,
            background: `linear-gradient(45deg, ${napkin.color}15, transparent)`,
            clipPath: 'polygon(100% 0, 0 100%, 100% 100%)'
          }}
        />
        
        <Stack align="center" gap="md">
          <Button
            variant="outline"
            size="lg"
            style={{
              borderColor: napkin.color,
              color: napkin.color,
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              padding: '1rem 2rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = napkin.color;
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = napkin.color;
            }}
          >
            {napkin.demo}
          </Button>
        </Stack>
      </Card>
    );
  };

  // Add CSS keyframes to document head
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Box style={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
      {/* Hero Section */}
      <Container size="lg" py="xl">
        <Stack align="center" gap="xl" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Box
            style={{
              position: 'relative',
              display: 'inline-block'
            }}
          >
            <Title
              order={1}
              size="3rem"
              style={{
                background: 'linear-gradient(135deg, #011B58, #0629D3, #5326A5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: 'monospace',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                position: 'relative',
                zIndex: 2
              }}
            >
              AppConnectors UI Napkins
            </Title>
            
            {/* Sketchy underline */}
            <Box
              style={{
                position: 'absolute',
                bottom: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80%',
                height: 4,
                background: 'linear-gradient(90deg, transparent, #0629D3, transparent)',
                borderRadius: '2px',
                opacity: 0.6
              }}
            />
          </Box>
          
          {/* Cyber accent elements - using subtle cyberpunk colors */}
          <Group gap="xs" style={{ opacity: 0.3 }}>
            <Box w={20} h={2} bg="#ABE7FF" style={{ borderRadius: '1px' }} />
            <Box w={8} h={8} bg="#F255A" style={{ borderRadius: '50%' }} />
            <Box w={20} h={2} bg="#ABE7FF" style={{ borderRadius: '1px' }} />
          </Group>
        </Stack>

        {/* Napkins Grid */}
        <Grid gutter="xl">
          {napkins.map((napkin, index) => (
            <Grid.Col key={napkin.id} span={{ base: 12, md: 4 }}>
              <NapkinCard napkin={napkin} index={index} />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage; 