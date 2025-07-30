import React, { useState } from 'react';
import { Group, ActionIcon, Text, Collapse, Textarea, Button, Badge } from '@mantine/core';
import { IconThumbUp, IconThumbDown, IconCheck } from '@tabler/icons-react';

interface ResponseFeedbackProps {
  messageId: string;
  query: string;
  response: string;
  source: 'llm' | 'pattern' | 'cache';
  confidence?: number;
  onFeedback?: (feedback: FeedbackData) => void;
}

interface FeedbackData {
  messageId: string;
  query: string;
  response: string;
  source: 'llm' | 'pattern' | 'cache';
  confidence?: number;
  rating: 'positive' | 'negative';
  comment?: string;
  timestamp: Date;
}

// Convert confidence to descriptive terms and colors (Apple design approach)
const getConfidenceLabel = (confidence: number): string => {
  if (confidence >= 0.9) return "High confidence";
  if (confidence >= 0.75) return "Medium confidence";
  if (confidence >= 0.6) return "Low confidence";
  return "Very low confidence";
};

// Apple-inspired color mapping for confidence levels
const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 0.9) return "green";    // High: Success green (Apple's positive indicator)
  if (confidence >= 0.75) return "blue";    // Medium: Trustworthy blue (Apple's primary)
  if (confidence >= 0.6) return "orange";   // Low: Warning orange (Apple's caution)
  return "red";                             // Very low: Alert red (Apple's error)
};

const ResponseFeedback: React.FC<ResponseFeedbackProps> = ({
  messageId,
  query,
  response,
  source,
  confidence,
  onFeedback
}) => {
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFeedback = (rating: 'positive' | 'negative') => {
    setFeedback(rating);
    
    if (rating === 'positive') {
      // For positive feedback, submit immediately
      submitFeedback(rating, '');
    } else {
      // For negative feedback, ask for comment
      setShowComment(true);
    }
  };

  const submitFeedback = (rating: 'positive' | 'negative', feedbackComment: string = '') => {
    const feedbackData: FeedbackData = {
      messageId,
      query,
      response,
      source,
      confidence,
      rating,
      comment: feedbackComment || undefined,
      timestamp: new Date()
    };

    // Store feedback locally
    storeFeedback(feedbackData);
    
    // Call callback if provided
    onFeedback?.(feedbackData);
    
    setSubmitted(true);
    setShowComment(false);
    
    console.log('📊 [FEEDBACK COLLECTED]', {
      rating,
      source,
      confidence,
      hasComment: !!feedbackComment
    });
  };

  const storeFeedback = (data: FeedbackData) => {
    try {
      const existing = JSON.parse(localStorage.getItem('ai_response_feedback') || '[]');
      existing.push(data);
      
      // Keep only last 100 feedback entries to prevent storage bloat
      const trimmed = existing.slice(-100);
      localStorage.setItem('ai_response_feedback', JSON.stringify(trimmed));
    } catch (error) {
      console.warn('Failed to store feedback:', error);
    }
  };

  if (submitted) {
    return (
      <Group gap="xs" style={{ opacity: 0.7 }}>
        <IconCheck size={14} color="#22c55e" />
        <Text size="xs" c="dimmed">
          Thank you for your feedback!
        </Text>
      </Group>
    );
  }

  return (
    <div>
      <Group gap="sm" align="center">
        <Text size="xs" c="dimmed">Was this helpful?</Text>
        
        <Group gap="xs">
          <ActionIcon
            variant={feedback === 'positive' ? 'filled' : 'subtle'}
            color={feedback === 'positive' ? 'green' : 'gray'}
            size="sm"
            onClick={() => handleFeedback('positive')}
          >
            <IconThumbUp size={12} />
          </ActionIcon>
          
          <ActionIcon
            variant={feedback === 'negative' ? 'filled' : 'subtle'}
            color={feedback === 'negative' ? 'red' : 'gray'}
            size="sm"
            onClick={() => handleFeedback('negative')}
          >
            <IconThumbDown size={12} />
          </ActionIcon>
        </Group>

        {/* Source indicator for training purposes - Hidden as requested */}
        {/* <Badge 
          size="xs" 
          variant="dot" 
          color={source === 'llm' ? 'blue' : source === 'cache' ? 'violet' : 'orange'}
        >
          {source.toUpperCase()}
        </Badge> */}

        {confidence && (
          <Badge 
            size="sm" 
            variant="light"
            color={getConfidenceColor(confidence)}
            style={{ 
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '10px'
            }}
          >
            {getConfidenceLabel(confidence)}
          </Badge>
        )}
      </Group>

      {/* Comment form for negative feedback */}
      <Collapse in={showComment} mt="sm">
        <div style={{ 
          backgroundColor: '#fef2f2', 
          padding: '12px', 
          borderRadius: '8px',
          border: '1px solid #fecaca'
        }}>
          <Text size="sm" fw={500} mb="xs">
            Help us improve - what went wrong?
          </Text>
          
          <Textarea
            placeholder="The response was unclear, incorrect, or didn't match my request..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            minRows={2}
            maxRows={4}
            size="sm"
            mb="sm"
          />
          
          <Group gap="sm">
            <Button
              size="xs"
              onClick={() => submitFeedback('negative', comment)}
              style={{ backgroundColor: '#dc2626' }}
            >
              Submit Feedback
            </Button>
            <Button
              size="xs"
              variant="outline"
              onClick={() => {
                setShowComment(false);
                setFeedback(null);
              }}
            >
              Cancel
            </Button>
          </Group>
        </div>
      </Collapse>
    </div>
  );
};

export default ResponseFeedback;

// Utility function to get all stored feedback
export const getAllFeedback = (): FeedbackData[] => {
  try {
    return JSON.parse(localStorage.getItem('ai_response_feedback') || '[]');
  } catch {
    return [];
  }
};

// Utility function to get feedback statistics
export const getFeedbackStats = () => {
  const feedback = getAllFeedback();
  const positive = feedback.filter(f => f.rating === 'positive').length;
  const negative = feedback.filter(f => f.rating === 'negative').length;
  const total = feedback.length;
  
  const bySource = feedback.reduce((acc, f) => {
    acc[f.source] = (acc[f.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    total,
    positive,
    negative,
    positiveRate: total > 0 ? (positive / total * 100).toFixed(1) : '0',
    bySource,
    recent: feedback.slice(-10).reverse()
  };
}; 