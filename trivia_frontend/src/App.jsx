import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Users from './pages/Users';

const router = createBrowserRouter([
  {
      path: "/users",
      element: <Users />,
  }
]);

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <RouterProvider router = {router} />
    </>
  )
}

export default App
