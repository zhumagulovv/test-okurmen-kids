import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { lazy, Suspense, useEffect } from "react"

import { Loading } from "./components/common/loading"
import MainLayout from "./components/layout/MainLayout"
import TestLayout from "./components/layout/TestLayout"

const EntryPage = lazy(() => import("./pages/EntryPage"))
const HomePage = lazy(() => import("./pages/HomePage"))
const LiderBortPage = lazy(() => import("./pages/LiderBortPage"))
const NamePage = lazy(() => import("./pages/NamePage"))
const TestPage = lazy(() => import("./pages/TestPage"))
const ResultPage = lazy(() => import("./pages/ResultPage"))

import ProtectedRoute from "./ProtectedRoute"
import AppInt from "./AppInt"

const ProtectedLayout = () => (
  <ProtectedRoute>
    <TestLayout />
  </ProtectedRoute>
)

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
    path: "/",
    element: <ProtectedLayout />,
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
      <Suspense fallback={<Loading />}>
        <RouterProvider router={routes} />
      </Suspense>
    </>
  )
}
export default App
