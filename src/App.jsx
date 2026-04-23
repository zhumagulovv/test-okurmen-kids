import { createBrowserRouter, RouterProvider } from "react-router-dom"

import MainLayout from "./components/layout/MainLayout"

import HomePage from "./pages/HomePage"
import LiderBortPage from "./pages/LiderBortPage"
import EntryPage from "./pages/EntryPage"
import NamePage from "./pages/NamePage"
import TestPage from "./pages/TestPage"
import ResultPage from "./pages/ResultPage"
import ProtectedRoute from "./ProtectedRoute"
import TestLayout from "./components/layout/TestLayout"
import AppInt from "./AppInt"


const routes = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/leaderboard', element: <LiderBortPage /> },
    ]
  },
  {
    element: (
      <ProtectedRoute>
        <TestLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/entry-page', element: <EntryPage /> },
      {
        path: "/name-page",
        element: <NamePage />
      },
      {
        path: "/test-page",
        element: <TestPage />
      },
      {
        path: "/result-page",
        element: <ResultPage />
      }
    ]
  },

  {
    path: '*',
    element: <h1 className="text-3xl font-bold text-center mt-20">404 - Страница не найдена</h1>
  }
])

function App() {
  return (
    <>
      <AppInt />
      <RouterProvider router={routes} />
    </>
  )
}
export default App
