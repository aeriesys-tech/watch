import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Dashboard from "./Pages/Dashboard/Dashboard";
import Login from "./Pages/Login/Login";
import Sidebar from "./Components/Sidebar/Sidebar";
import User from "./Pages/User";
import Role from "./Pages/Role";
import Profile from "./Pages/Login/Profile";
import ChangePassword from "./Pages/Login/ChangePassword";
import ForgotPassword from "./Pages/Login/ForgotPassword";
import Permission from "./Pages/Permission";
import Unit from "./Pages/Unit";
import DeviceType from "./Pages/DeviceType";
import CheckGroup from "./Pages/CheckGroup";
import Client from "./Pages/Client";
import ClientUser from "./Pages/ClientUser";
import CheckParameter from "./Pages/CheckParameter";
import Device from "./Pages/Device";
import DeviceUser from "./Pages/DeviceUser";
import ClientDetail from "./Pages/ClientDetail";

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
          <Route path="/permissions" element={<Permission />} />
          <Route path="/units" element={<Unit />} />
          <Route path="/deviceTypes" element={<DeviceType />} />
          <Route path="/checkGroups" element={<CheckGroup />} />
          <Route path="/clients" element={<Client />} />
          <Route path="/clientUsers" element={<ClientUser />} />
          <Route path="/checkParameters" element={<CheckParameter />} />
          <Route path="/devices" element={<Device />} />
          <Route path="/deviceUsers" element={<DeviceUser />} />
          <Route path="/client/:client_id" element={<ClientDetail />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
