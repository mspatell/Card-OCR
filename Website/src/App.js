import React, { lazy, Suspense, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import PersonIcon from "@mui/icons-material/Person"; // Import Person Icon
import { useAuth } from "./hooks/useAuth"; 
import "./styles/App.css";

// Lazy loaded components
const InfoCard = lazy(() => import("./components/InfoCard/infoCard.jsx"));
const List = lazy(() => import("./components/List/list.jsx"));
const SignUp = lazy(() => import("./pages/SignUp/SignUp.jsx"));
const Login = lazy(() => import("./pages/Login/Login.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard.jsx"));
const Footer = lazy(() => import("./components/Footer/footer.jsx"));

const App = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="primary" elevation={1}>
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <img 
                src="/cws-logo.png" 
                alt="AI Phone Directory" 
                style={{ height: '32px', marginRight: '12px' }}
              />
              {/* <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                AI Phone Directory
              </Typography> */}
            </Box>
            {isAuthenticated && (
              <>
                {/* <Button color="inherit" href="/dashboard">
                  Scan More
                </Button> */}
                <Button color="inherit" href="/list">
                  Saved Contacts
                </Button>
                {user && (
                  <>
                    <Tooltip title="Profile">
                      <IconButton onClick={handleMenuOpen} sx={{ ml: 2 }}>
                        <Avatar sx={{ bgcolor: "secondary.main" }}>
                          <PersonIcon />
                        </Avatar>
                      </IconButton>
                    </Tooltip>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      PaperProps={{
                        elevation: 3,
                        sx: {
                          mt: 1.5,
                          minWidth: 200,
                          borderRadius: 2,
                          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                        },
                      }}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                    >
                      <Box sx={{ px: 2, py: 1.5 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {user.name || "User"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.email || "No email"}
                        </Typography>
                      </Box>
                      <Divider />
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                  </>
                )}
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/info-card" element={<InfoCard />} />
          <Route path="/list" element={<List />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
        </Routes>
        <Footer />
      </Suspense>
    </Router>
  );
};

export default App;
