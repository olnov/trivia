import { useState } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Navbar from "./pages/Navbar"; // Import your Navbar component
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";

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
        element: <Home />,
      },
      {
        path: "/game",
        element: <Game />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/leaderboard",
    element: <Leaderboard />,
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
