import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import FileUpload from './components/fileUpload';
import InfoCard from './components/infoCard';
import List from './components/list';
import SignUp from './components/signUp';
import Login from './components/login';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import './App.css';

function App() {
  return (
    <div>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Card Scanner
          </Typography>
          {
            localStorage.getItem('user_sub') ?
            <div>
              <Button className="header-button" color="inherit" onClick={()=>{window.location="/dashboard"}}> + Upload</Button>
              <Button className="header-button" color="inherit" onClick={()=>{window.location="/list"}}>Your Cards</Button>
              <Button color="inherit" onClick={()=>{localStorage.removeItem('user_sub');window.location="/login"}}>Logout</Button>
            </div>:
            <div>
              <Button color="inherit" onClick={()=>{window.location="/login"}}>Login</Button>
              <Button color="inherit" onClick={()=>{window.location="/signup"}}>Sign Up</Button>
            </div>
          }
        </Toolbar>
      </AppBar>
    </Box>
    <Router>
      <Routes>
        <Route path="/info-card" element={<InfoCard />} />
        <Route path="/list" element={<List />} />
        <Route path="/dashboard" element={<FileUpload />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate replace to="/login" />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
