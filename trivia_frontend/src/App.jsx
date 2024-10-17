import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Users from "./pages/Users";
import Home from "./pages/Home";
import Game from "./pages/Game";

const router = createBrowserRouter([
  {
    path: "/users",
    element: <Users />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/game",
    element: <Game />,
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
