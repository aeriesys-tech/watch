import React from 'react'
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Dashboard from './Pages/Dashboard/Dashboard';
import Login from './Pages/Login/Login';
import Sidebar from './Components/Sidebar/Sidebar';
import User from './Pages/User';
import Role from './Pages/Role';
import Profile from './Pages/Login/Profile';
import ChangePassword from './Pages/Login/ChangePassword';
import ForgotPassword from './Pages/Login/ForgotPassword';



function App() {
  return (
    <div>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sidebar" element={<Sidebar />} />
          <Route path="/users" element={<User />} />
          <Route path="/roles" element={<Role />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/forget-password" element={<ForgotPassword />} />
        </Routes>
      </Router>
      {/* <Login /> */}
      {/* <Dashboard /> */}
    </div>
  );
}

export default App;