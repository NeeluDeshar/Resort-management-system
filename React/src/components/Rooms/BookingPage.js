import React, { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import HeadTitle from "../../common/HeadTitle/HeadTitle"
import API from "../../api"
import "./BookingPage.css"

const BookingPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)

  // Pre-fill from logged-in user
  const storedUser = JSON.parse(localStorage.getItem("user") || "null")
  const token = localStorage.getItem("token")
  const today = new Date().toISOString().split("T")[0]

  const [form, setForm] = useState({
    fullName: storedUser?.name || "",
    email: storedUser?.email || "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    specialRequests: "",
    paymentMethod: "Cash on Arrival",
    referenceNumber: "",
  })

  useEffect(() => {
    API.get(`/rooms/${id}`)
      .then((res) => setRoom(res.data))
      .catch(() => navigate("/room"))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const calcNights = () => {
    if (!form.checkIn || !form.checkOut) return 0
    const diff = new Date(form.checkOut) - new Date(form.checkIn)
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  const nights = calcNights()
  const total = room ? nights * room.price : 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (nights <= 0) {
      setMessage({ type: "error", text: "Check-out must be after check-in." })
      return
    }
    setSubmitting(true)
    setMessage(null)
    try {
      await API.post("/bookings", {
        room_id: room.id,
        full_name: form.fullName,
        phone: form.phone,
        check_in: form.checkIn,
        check_out: form.checkOut,
        guests: form.guests,
        special_requests: form.specialRequests,
        payment_method: form.paymentMethod,
        reference_number: form.referenceNumber,
      })
      setMessage({ type: "success", text: "Booking confirmed! Enjoy your stay." })
      setTimeout(() => navigate("/room"), 2500)
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.error || "Booking failed. Please try again." })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p style={{ textAlign: "center", padding: "80px" }}>Loading room details...</p>
  if (!room) return null

  return (
    <>
      <HeadTitle />
      <section className="booking-page">
        <div className="container">
          <div className="booking-layout">

            {/* Left — Room Summary */}
            <div className="booking-summary">
              <img src={`/${room.image}`} alt={room.name} className="booking-summary__image" />
              <div className="booking-summary__info">
                <span className="booking-summary__type">{room.room_type}</span>
                <h2 className="booking-summary__name">{room.name}</h2>
                {room.description && <p className="booking-summary__desc">{room.description}</p>}
                <div className="booking-summary__price">
                  <span className="booking-summary__price-amount">Rs. {Number(room.price).toLocaleString()}</span>
                  <span className="booking-summary__price-label">/ night</span>
                </div>
              </div>
            </div>

            {/* Right — Booking Form */}
            <div className="booking-form-card">
              <h2>Reserve Your Room</h2>

              {!token && (
                <div className="booking-login-notice">
                  You need to <Link to="/sign-in">sign in</Link> before booking.
                </div>
              )}

              {message && (
                <div className={`booking-msg booking-msg--${message.type}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-section-label">Guest Details</div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={set("fullName")}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={form.email}
                      readOnly
                      className="input-readonly"
                      title="Email from your account"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="+977-XXXXXXXXXX"
                    required
                  />
                </div>

                <div className="form-section-label" style={{ marginTop: "20px" }}>Stay Details</div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Check-in Date</label>
                    <input
                      type="date"
                      min={today}
                      value={form.checkIn}
                      onChange={set("checkIn")}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Check-out Date</label>
                    <input
                      type="date"
                      min={form.checkIn || today}
                      value={form.checkOut}
                      onChange={set("checkOut")}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Number of Guests</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={form.guests}
                    onChange={set("guests")}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Special Requests <span className="optional">(optional)</span></label>
                  <textarea
                    value={form.specialRequests}
                    onChange={set("specialRequests")}
                    placeholder="Any special requirements or requests..."
                    rows={3}
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

                {nights > 0 && (
                  <div className="booking-total">
                    <span>{nights} night{nights > 1 ? "s" : ""} × Rs. {Number(room.price).toLocaleString()}</span>
                    <strong>Rs. {total.toLocaleString()}</strong>
                  </div>
                )}

                <button
                  type="submit"
                  className="booking-submit-btn"
                  disabled={!token || submitting}
                >
                  {submitting ? "Confirming..." : "Confirm Booking"}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

export default BookingPage
