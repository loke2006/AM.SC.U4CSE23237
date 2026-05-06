import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const Navbar = () => {
  const location = useLocation();

  return (
    <AppBar position="fixed" elevation={1} sx={{ backgroundColor: '#fff', color: '#333' }}>
      <Toolbar>
        <NotificationsActiveIcon sx={{ color: '#1976d2', mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, color: '#1a237e' }}>
          Campus Notifications
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            component={RouterLink} 
            to="/" 
            variant={location.pathname === '/' ? 'contained' : 'text'}
            color="primary"
            disableElevation
          >
            Dashboard
          </Button>
          <Button 
            component={RouterLink} 
            to="/filter" 
            variant={location.pathname === '/filter' ? 'contained' : 'text'}
            color="primary"
            disableElevation
          >
            Filter Notifications
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
