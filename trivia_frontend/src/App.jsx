import { useState } from "react";

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import "./App.css";
import Navbar from "./pages/Navbar"; // Import your Navbar component
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Leaderboard from "./pages/Leaderboard";
import UserProfileEdit from "./pages/Profile";
import Multiplayer from "./pages/Multiplayer";
import MultiGame from "./pages/MultiGame";

import { ReactElement } from "react";

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
const LayoutWithNavbar = () => (
  <>
    <Navbar /> {/* Navbar displayed on all pages */}
    <Outlet /> {/* Content of the current route */}
  </>
);

const LayoutWithoutNavbar = () => (
  <>
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    element: <LayoutWithoutNavbar />, // Apply Layout (Navbar + dynamic content)
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
  {
    element: <LayoutWithNavbar />,
    children: [
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
        element: <ProtectedRoute element={<UserProfileEdit />} />,
      },
      {
        path: "/multiplayer",
        element: <ProtectedRoute element={<Multiplayer />} />,
      },
      {
        path: "/game/multi",
        element: <ProtectedRoute element={<MultiGame />} />,
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
