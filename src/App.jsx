import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AppLayout from "./components/AppLayout";
import Venue from "./pages/venue";
import UserManagement from "./pages/UserManagement";
import OrganizationManagement from "./pages/OrgnaizationManagement";
import DeviceManagement from "./pages/DeviceManagement";
import PageNotFound from "./components/PageNotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SetupPassword from "./components/auth/SetupPassword";
import VerifyOtp from "./components/auth/VerifyOtp";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UserStatusChecker from "./components/users/UserStatusChecker";

const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <UserStatusChecker />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/setup-password/:token" element={<SetupPassword />} />
        <Route path="/verify-otp/:token" element={<VerifyOtp />} />

        {/* Home - All logged users */}
        <Route element={<ProtectedRoute allowedRoles={["admin", "manager", "user"]} />}>
          <Route element={<AppLayout />}>
            <Route index element={<Home />} />
          </Route>
        </Route>

        {/* Admin + Manager */}
        <Route element={<ProtectedRoute allowedRoles={["admin", "manager"]} />}>
          <Route element={<AppLayout />}>
            <Route path="venue" element={<Venue />} />
            <Route path="user" element={<UserManagement />} />

          </Route>
        </Route>

        {/* Admin only */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<AppLayout />}>
            <Route path="organization" element={<OrganizationManagement />} />
            <Route path="device" element={<DeviceManagement />} />
          </Route>
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default App;
