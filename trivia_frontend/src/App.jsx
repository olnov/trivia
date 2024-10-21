import { useState } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Leaderboard from "./pages/Leaderboard";

const isAuthenticated = () => {
  const token = localStorage.getItem('token'); // Assume JWT token is stored in localStorage
  if (token) {
      try {
          const payload = JSON.parse(atob(token.split('.')[1])); // Decode token payload
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


const router = createBrowserRouter([
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
    element: <ProtectedRoute route={Home} />,
  },
  {
    path: "/game",
    element: <ProtectedRoute route={Game} />,
  },
  {
    path: "/leaderboard",
    element: <ProtectedRoute route={Leaderboard} />,
  },
]);

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
