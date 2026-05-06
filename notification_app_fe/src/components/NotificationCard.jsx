import React from 'react';
import { Card, CardContent, Typography, Chip, Box, Badge } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

const typeColors = {
  Event: 'primary',
  Result: 'success',
  Placement: 'secondary',
};

const NotificationCard = ({ notification, isNew, onClick }) => {
  return (
    <Badge
      color="error"
      variant="dot"
      invisible={!isNew}
      sx={{ width: '100%', mb: 2, display: 'block' }}
    >
      <Card 
        onClick={() => onClick(notification.ID)}
        sx={{ 
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backgroundColor: isNew ? '#f8fbff' : '#ffffff',
          borderLeft: isNew ? '4px solid #1976d2' : '4px solid transparent',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 3
          }
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Chip 
              label={notification.Type} 
              size="small" 
              color={typeColors[notification.Type] || 'default'} 
            />
            <Typography variant="caption" color="text.secondary">
              {formatDistanceToNow(new Date(notification.Timestamp), { addSuffix: true })}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: isNew ? 600 : 400, color: '#333' }}>
            {notification.Message}
          </Typography>
        </CardContent>
      </Card>
    </Badge>
  );
};

export default NotificationCard;
