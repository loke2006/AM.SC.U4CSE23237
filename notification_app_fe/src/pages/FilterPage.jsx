import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Box, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import NotificationCard from '../components/NotificationCard';
import { fetchNotifications } from '../api';

const FilterPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [type, setType] = useState('Event');
  const [viewedIds, setViewedIds] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('viewedNotifications');
    if (saved) {
      setViewedIds(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    loadFilteredData();
  }, [type]);

  const loadFilteredData = async () => {
    try {
      setLoading(true);
      // Backend API allows query params: ?notification_type=Event
      const data = await fetchNotifications(null, null, type);
      setNotifications(data);
    } catch (err) {
      setError('Failed to fetch filtered notifications.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsViewed = (id) => {
    if (!viewedIds.includes(id)) {
      const updated = [...viewedIds, id];
      setViewedIds(updated);
      localStorage.setItem('viewedNotifications', JSON.stringify(updated));
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ p: 4, backgroundColor: '#fff', borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: '#333' }}>
          Filter Notifications
        </Typography>

        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel id="type-select-label">Notification Type</InputLabel>
          <Select
            labelId="type-select-label"
            value={type}
            label="Notification Type"
            onChange={(e) => setType(e.target.value)}
          >
            <MenuItem value="Event">Event</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
          </Select>
        </FormControl>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : notifications.length === 0 ? (
          <Typography color="text.secondary">No notifications found for this type.</Typography>
        ) : (
          <Grid container spacing={2}>
            {notifications.map(notif => (
              <Grid item xs={12} key={notif.ID}>
                <NotificationCard 
                  notification={notif} 
                  isNew={!viewedIds.includes(notif.ID)}
                  onClick={markAsViewed}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default FilterPage;
