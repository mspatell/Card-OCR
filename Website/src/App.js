import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import TopNavigation from "@cloudscape-design/components/top-navigation";
import { useAuth } from "./hooks/useAuth";
import "./styles/App.css";

const List = lazy(() => import("./components/List/list.jsx"));
const SignUp = lazy(() => import("./pages/SignUp/SignUp.jsx"));
const Login = lazy(() => import("./pages/Login/Login.jsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword/ForgotPassword.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard.jsx"));
const PackageList = lazy(() => import("./pages/Dashboard/PackageList.jsx"));

const App = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <Router>
      {isAuthenticated && (
        <TopNavigation
          identity={{
            href: "/dashboard",
            title: "AI Capture & Save",
            logo: { src: "/cws-logo.png", alt: "AI Capture & Save" },
          }}
          utilities={[
            {
              type: "button",
              text: "Scan",
              href: "/dashboard",
              iconName: "search",
            },
            {
              type: "button",
              text: "Saved Contacts",
              href: "/list",
              iconName: "contact",
            },
            {
              type: "button",
              text: "Logged Packages",
              href: "/package-list",
              iconName: "contact",
            },
            {
              type: "menu-dropdown",
              text: user?.name || "Account",
              description: user?.email || "",
              iconName: "user-profile",
              items: [
                { id: "signout", text: "Sign out" },
              ],
              onItemClick: ({ detail }) => {
                if (detail.id === "signout") logout();
              },
            },
          ]}
        />
      )}

      <Suspense fallback={<div style={{ padding: 40, textAlign: "center", color: "#5f6b7a" }}>Loading...</div>}>
        <Routes>
          <Route path="/package-list" element={<PackageList />} />
          <Route path="/list" element={<List />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
