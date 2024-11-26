import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

const Login = lazy(() => import('@/pages/Login/Login'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

      </Routes>
      </BrowserRouter>
    </Suspense>
  )
}

export default App
