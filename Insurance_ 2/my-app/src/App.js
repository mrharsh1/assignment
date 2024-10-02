import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Drawer, List, ListItem, ListItemText, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Home from './pages/Home';
import AllData from './pages/AllData';
import AddForm from './pages/AddForm';

const App = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Manage Employee Data in the Parent Component
  const [employeeData, setEmployeeData] = useState([]);

  // Function to add new employee data
  const addEmployeeData = (newEmployee) => {
    setEmployeeData([...employeeData, newEmployee]);
  };

  // Toggle Sidebar
  const toggleDrawer = () => setOpen(!open);

  // Handle User Menu
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Router>
      <div>
        {/* App Bar */}
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Admin Panel
            </Typography>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <AccountCircleIcon />
            </IconButton>
            {/* User Menu */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
              <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
              <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Sidebar */}
        <Drawer open={open} onClose={toggleDrawer}>
          <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer}>
            <List>
              <ListItem button component={Link} to="/">
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem button component={Link} to="/all-data">
                <ListItemText primary="All Data" />
              </ListItem>
              <ListItem button component={Link} to="/add-form">
                <ListItemText primary="Add Form" />
              </ListItem>
            </List>
          </Box>
        </Drawer>

        {/* Page Content */}
        <Box p={2}>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Pass employee data as props to AllData */}
            <Route path="/all-data" element={<AllData employeeData={employeeData} />} />
            {/* Pass addEmployeeData function as a prop to AddForm */}
            <Route path="/add-form" element={<AddForm addEmployeeData={addEmployeeData} />} />
          </Routes>
        </Box>
      </div>
    </Router>
  );
};

export default App;
