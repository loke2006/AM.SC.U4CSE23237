import React, { useEffect, useState, useMemo } from 'react';
import { Container, Grid, Typography, CircularProgress, Box, Divider, TextField, Button } from '@mui/material';
import NotificationCard from '../components/NotificationCard';
import { fetchNotifications } from '../api';

const Home = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewedIds, setViewedIds] = useState([]);
  const [priorityCount, setPriorityCount] = useState(10);
  const [nInput, setNInput] = useState('10');

  useEffect(() => {
    const saved = localStorage.getItem('viewedNotifications');
    if (saved) {
      setViewedIds(JSON.parse(saved));
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (err) {
      setError('Failed to fetch notifications.');
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

  const handleUpdateN = () => {
    const parsed = parseInt(nInput, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setPriorityCount(parsed);
    }
  };

  // Priority Calculation: Placement (3) > Result (2) > Event (1)
  const priorityList = useMemo(() => {
    const weight = { Placement: 3, Result: 2, Event: 1 };
    
    // Sort by weight descending, then by timestamp descending
    return [...notifications].sort((a, b) => {
      const weightDiff = (weight[b.Type] || 0) - (weight[a.Type] || 0);
      if (weightDiff !== 0) return weightDiff;
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    }).slice(0, priorityCount);
  }, [notifications, priorityCount]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Typography color="error" align="center" sx={{ mt: 4 }}>{error}</Typography>;
  }

  return (
    <Container maxWidth="xl">
      <Grid container spacing={4}>
        {/* Left Column: Priority Notifications */}
        <Grid item xs={12} md={5}>
          <Box sx={{ mb: 3, p: 3, backgroundColor: '#fff', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#f50057', mb: 2 }}>
              🔥 Priority Inbox
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="body2">Show Top N:</Typography>
              <TextField 
                size="small" 
                type="number" 
                value={nInput} 
                onChange={(e) => setNInput(e.target.value)} 
                sx={{ width: 80 }}
              />
              <Button variant="outlined" size="small" onClick={handleUpdateN}>Update</Button>
            </Box>
            
            {priorityList.length === 0 ? (
              <Typography color="text.secondary">No notifications available.</Typography>
            ) : (
              priorityList.map(notif => (
                <NotificationCard 
                  key={notif.ID} 
                  notification={notif} 
                  isNew={!viewedIds.includes(notif.ID)}
                  onClick={markAsViewed}
                />
              ))
            )}
          </Box>
        </Grid>

        {/* Right Column: All Notifications */}
        <Grid item xs={12} md={7}>
          <Box sx={{ p: 3, backgroundColor: '#fff', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 3 }}>
              All Notifications
            </Typography>
            {notifications.length === 0 ? (
              <Typography color="text.secondary">No notifications available.</Typography>
            ) : (
              notifications.map(notif => (
                <NotificationCard 
                  key={notif.ID} 
                  notification={notif} 
                  isNew={!viewedIds.includes(notif.ID)}
                  onClick={markAsViewed}
                />
              ))
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
