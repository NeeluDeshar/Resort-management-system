import React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import Bookings from "./pages/Bookings"
import EventBookings from "./pages/EventBookings"
import Users from "./pages/Users"
import RoomsManager from "./pages/RoomsManager"
import Contacts from "./pages/Contacts"
import Newsletter from "./pages/Newsletter"
import "./App.css"

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken")
  return token ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Layout>
                <Routes>
                  <Route path="/"               element={<Dashboard />} />
                  <Route path="/bookings"        element={<Bookings />} />
                  <Route path="/event-bookings"  element={<EventBookings />} />
                  <Route path="/users"           element={<Users />} />
                  <Route path="/rooms"           element={<RoomsManager />} />
                  <Route path="/contacts"        element={<Contacts />} />
                  <Route path="/newsletter"      element={<Newsletter />} />
                </Routes>
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
