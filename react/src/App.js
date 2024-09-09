import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Dashboard from "./Pages/Dashboard/Dashboard";
import Dashboard1 from "./Pages/Dashboard/Dashboard1";
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
import CombinedDeviceClientUser from "./Pages/CombinedDeviceClientUser";
import Unauthorized from "./Pages/Unauthorized ";
import PermissionBasedRoute from "./Services/PermissionBasedRoute";
import Subscribers from "./Pages/Subscribers";
import SubscribersDetails from "./Pages/SubscribersDetails";
import AlertDetails from "./Pages/AlertDetails";
function App() {
  return (
    <div>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard1" element={<Dashboard1 />} />
          <Route path="/sidebar" element={<Sidebar />} />
          <Route
            path="/users"
            element={
              <PermissionBasedRoute requiredPermissions={["users.view"]}>
                <User />
              </PermissionBasedRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <PermissionBasedRoute requiredPermissions={["roles.view"]}>
                <Role />
              </PermissionBasedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PermissionBasedRoute requiredPermissions={["users.view"]}>
                <Profile />
              </PermissionBasedRoute>
            }
          />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/forget-password" element={<ForgotPassword />} />
          <Route
            path="/permissions"
            element={
              <PermissionBasedRoute
                requiredPermissions={["role_abilities.view"]}
              >
                <Permission />
              </PermissionBasedRoute>
            }
          />
          <Route
            path="/units"
            element={
              <PermissionBasedRoute requiredPermissions={["units.view"]}>
                <Unit />
              </PermissionBasedRoute>
            }
          />
          <Route
            path="/deviceTypes"
            element={
              <PermissionBasedRoute requiredPermissions={["device_types.view"]}>
                <DeviceType />
              </PermissionBasedRoute>
            }
          />
          <Route
            path="/checkGroups"
            element={
              <PermissionBasedRoute requiredPermissions={["check_groups.view"]}>
                <CheckGroup />
              </PermissionBasedRoute>
            }
          />
          <Route
            path="/clients"
            element={
              <PermissionBasedRoute requiredPermissions={["clients.view"]}>
                <Client />
              </PermissionBasedRoute>
            }
          />
          <Route
            path="/clientUsers"
            element={
              <PermissionBasedRoute requiredPermissions={["client_users.view"]}>
                <ClientUser />
              </PermissionBasedRoute>
            }
          />
          <Route
            path="/checkParameters"
            element={
              <PermissionBasedRoute
                requiredPermissions={["check_parameters.view"]}
              >
                <CheckParameter />
              </PermissionBasedRoute>
            }
          />
          <Route
            path="/devices"
            element={
              <PermissionBasedRoute requiredPermissions={["devices.view"]}>
                <Device />
              </PermissionBasedRoute>
            }
          />
          <Route
            path="/deviceUsers"
            element={
              <PermissionBasedRoute requiredPermissions={["device_users.view"]}>
                <DeviceUser />
              </PermissionBasedRoute>
            }
          />
          <Route
            path="/client/:client_id"
            element={
              <PermissionBasedRoute requiredPermissions={["clients.view"]}>
                <CombinedDeviceClientUser />
              </PermissionBasedRoute>
            }
          />
          <Route
            path="/client/:client_id"
            element={<CombinedDeviceClientUser />}
          />

          <Route
            path="/subscribers"
            element={<Subscribers />}
          />

          <Route
            path="/subscribers/:subscriber_id"
            element={ <SubscribersDetails />}
          />
          <Route
            path="/subscribers/Alerts/:client_id"
            element={ <AlertDetails />}
          />

          <Route path="/unauthorized" element={<Unauthorized />} />{" "}
          <Route path="*" element={<Unauthorized />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
