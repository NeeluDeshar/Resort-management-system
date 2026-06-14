import React, { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import HeadTitle from "../../common/HeadTitle/HeadTitle"
import API from "../../api"
import Sdata from "./Sdata"
import "./EventBookingPage.css"

const EventBookingPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const event = Sdata.find((s) => s.id === parseInt(id))

  const storedUser = JSON.parse(localStorage.getItem("user") || "null")
  const token = localStorage.getItem("token")
  const today = new Date().toISOString().split("T")[0]

  const [form, setForm] = useState({
    fullName: storedUser?.name || "",
    email: storedUser?.email || "",
    phone: "",
    eventDate: "",
    guests: 1,
    duration: "Half Day (4 hrs)",
    specialRequests: "",
    paymentMethod: "Cash on Arrival",
    referenceNumber: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)

  if (!event) {
    navigate("/features")
    return null
  }

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)
    try {
      await API.post("/event-bookings", {
        event_type: event.title,
        full_name: form.fullName,
        phone: form.phone,
        email: form.email,
        event_date: form.eventDate,
        guests: form.guests,
        duration: form.duration,
        special_requests: form.specialRequests,
        payment_method: form.paymentMethod,
        reference_number: form.referenceNumber,
      })
      setMessage({ type: "success", text: `Your ${event.title} booking has been submitted! We'll contact you soon.` })
      setTimeout(() => navigate("/features"), 3000)
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.error || "Booking failed. Please try again." })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <HeadTitle />
      <section className="event-booking-page top">
        <div className="container">
          <div className="event-booking-layout">

            {/* Left — Event Summary */}
            <div className="event-summary">
              <img src={event.image} alt={event.title} className="event-summary__img" />
              <div className="event-summary__body">
                <span className="event-summary__tag">Special Occasion</span>
                <h2 className="event-summary__title">{event.title}</h2>
                <p className="event-summary__desc">{event.sidepara}</p>
                <ul className="event-summary__perks">
                  <li><i className="fas fa-check-circle"></i> Dedicated event coordinator</li>
                  <li><i className="fas fa-check-circle"></i> Custom decoration options</li>
                  <li><i className="fas fa-check-circle"></i> Catering & dining packages</li>
                  <li><i className="fas fa-check-circle"></i> Photography arrangements</li>
                </ul>
              </div>
            </div>

            {/* Right — Booking Form */}
            <div className="event-form-card">
              <h2>Book Your {event.title}</h2>

              {!token && (
                <div className="event-login-notice">
                  Please <Link to="/sign-in">sign in</Link> to make a booking.
                </div>
              )}

              {message && (
                <div className={`event-msg event-msg--${message.type}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-section-label">Your Details</div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" value={form.fullName} onChange={set("fullName")} placeholder="Your full name" required />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={form.email} readOnly className="input-readonly" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                    placeholder="10-digit phone number"
                    required
                  />
                </div>

                <div className="form-section-label" style={{ marginTop: "20px" }}>Event Details</div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Event Date</label>
                    <input type="date" min={today} value={form.eventDate} onChange={set("eventDate")} required />
                  </div>
                  <div className="form-group">
                    <label>Number of Guests</label>
                    <input type="number" min="1" max="500" value={form.guests} onChange={set("guests")} required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Duration</label>
                  <select value={form.duration} onChange={set("duration")} className="form-select">
                    <option>Half Day (4 hrs)</option>
                    <option>Full Day (8 hrs)</option>
                    <option>Evening (5 PM - 10 PM)</option>
                    <option>Full Weekend</option>
                    <option>Custom</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Special Requests <span className="optional">(optional)</span></label>
                  <textarea
                    value={form.specialRequests}
                    onChange={set("specialRequests")}
                    placeholder="Describe your vision, theme, dietary needs, etc."
                    rows={4}
                  />
                </div>

                <div className="form-section-label" style={{ marginTop: "20px" }}>Payment Method</div>

                <div className="payment-options">
                  {["Cash on Arrival", "GCash", "Bank Transfer"].map((method) => (
                    <label
                      key={method}
                      className={`payment-option ${form.paymentMethod === method ? "payment-option--active" : ""}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={form.paymentMethod === method}
                        onChange={set("paymentMethod")}
                      />
                      <span className="payment-option__icon">
                        {method === "Cash on Arrival" && <i className="fas fa-money-bill-wave"></i>}
                        {method === "GCash" && <i className="fas fa-mobile-alt"></i>}
                        {method === "Bank Transfer" && <i className="fas fa-university"></i>}
                      </span>
                      <span className="payment-option__label">{method}</span>
                    </label>
                  ))}
                </div>

                {form.paymentMethod === "GCash" && (
                  <div className="payment-info-box">
                    <p><i className="fas fa-info-circle"></i> Send payment to: <strong>09XX-XXX-XXXX</strong> (Resort GCash)</p>
                    <p>Enter the GCash reference number below after sending.</p>
                  </div>
                )}

                {form.paymentMethod === "Bank Transfer" && (
                  <div className="payment-info-box">
                    <p><i className="fas fa-info-circle"></i> Bank: <strong>BDO / BPI</strong></p>
                    <p>Account Name: <strong>Resort Management Inc.</strong></p>
                    <p>Account No: <strong>XXXX-XXXX-XXXX</strong></p>
                    <p>Enter your transaction reference number below after transferring.</p>
                  </div>
                )}

                {form.paymentMethod !== "Cash on Arrival" && (
                  <div className="form-group">
                    <label>Reference Number <span className="required-mark">*</span></label>
                    <input
                      type="text"
                      value={form.referenceNumber}
                      onChange={set("referenceNumber")}
                      placeholder={
                        form.paymentMethod === "GCash"
                          ? "e.g. 1234567890"
                          : "e.g. TXN-20240614-001"
                      }
                      required
                    />
                  </div>
                )}

                <button type="submit" className="event-submit-btn" disabled={!token || submitting}>
                  {submitting ? "Submitting..." : `Book ${event.title} Event`}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

export default EventBookingPage
