import { useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Navbar from "./pages/Navbar"; // Import your Navbar component
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Leaderboard from "./pages/Leaderboard";
import { ReactElement } from "react";
import Profile from "./pages/Profile";

const isAuthenticated = () => {
  const token = localStorage.getItem("token"); // Assume JWT token is stored in localStorage
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode token payload
      const currentTime = Date.now() / 1000; // Get current time in seconds
      return payload.exp > currentTime; // Check if token is expired
    } catch (error) {
      return false;
    }
  }
  return false;
};

const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

// Layout component that includes the Navbar
const Layout = () => (
  <>
    <Navbar /> {/* Navbar displayed on all pages */}
    <Outlet /> {/* Content of the current route */}
  </>
);

const router = createBrowserRouter([
  {
    element: <Layout />, // Apply Layout (Navbar + dynamic content)
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/home",
        element: <ProtectedRoute element={<Home />} />,
      },
      {
        path: "/game",
        element: <ProtectedRoute element={<Game />} />,
      },
      {
        path: "/leaderboard",
        element: <ProtectedRoute element={<Leaderboard />} />,
      },
      {
        path: "/profile",
        element: <ProtectedRoute element={<Profile />} />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
