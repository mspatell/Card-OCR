import React, { lazy, Suspense } from "react";
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
import { useAuth } from "./hooks/useAuth"; // custom hook
import "./App.css";

// Lazy load components
const FileUpload = lazy(() => import("./components/fileUpload"));
const InfoCard = lazy(() => import("./components/infoCard.jsx"));
const List = lazy(() => import("./components/list"));
const SignUp = lazy(() => import("./components/signUp"));
const Login = lazy(() => import("./components/login"));

const App = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Package Inventory {process.env.REACT_APP_STAGE}
            </Typography>
            {isAuthenticated && user && (
              <Box sx={{ mr: 2, textAlign: "right" }}>
                <Typography variant="body2">{user.name}</Typography>
                <Typography variant="caption">{user.email}</Typography>
              </Box>
            )}
            {isAuthenticated ? (
              <>
                <Button
                  className="header-button"
                  color="inherit"
                  href="https://logbook-fe.vercel.app/"
                >
                  Activity Log
                </Button>
                <Button
                  className="header-button"
                  color="inherit"
                  href="/dashboard"
                >
                  Scan More
                </Button>
                <Button className="header-button" color="inherit" href="/list">
                  Events
                </Button>
                <Button color="inherit" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" href="/login">
                  Login
                </Button>
                <Button color="inherit" href="/signup">
                  Sign Up
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/info-card" element={<InfoCard />} />
          <Route path="/list" element={<List />} />
          <Route path="/dashboard" element={<FileUpload />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
