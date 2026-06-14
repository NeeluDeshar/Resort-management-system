import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import API from "../api"
import "./Login.css"

const Login = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (localStorage.getItem("adminToken")) {
      navigate("/", { replace: true })
    }
  }, [navigate])

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await API.post("/admin/login", form)
      localStorage.setItem("adminToken", res.data.token)
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.error || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <span className="login-brand__dot"></span>
          Resort Admin
        </div>
        <h2>Sign in to Dashboard</h2>
        <p className="login-sub">Admin access only</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={submit}>
          <div className="login-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handle}
              placeholder="admin@resort.com"
              required
            />
          </div>
          <div className="login-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handle}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
