import React from "react"
import "./download.css"

const Download = () => {
  return (
    <section className="download top">
      <div className="container flex_space">
        <div className="row download-content">
          <h3>Download Our App</h3>
          <h1>Get the Resort App</h1>
          <ul>
            <li>&#10003; Get Paperless Confirmation</li>
            <li>&#10003; Easy Online Booking</li>
            <li>&#10003; Exclusive App-Only Deals</li>
            <li>&#10003; Instant Room Upgrades</li>
            <li>&#10003; Real-Time Notifications</li>
            <li>&#10003; 24/7 Concierge Support</li>
            <li>&#10003; Manage Your Reservations</li>
          </ul>
          <div className="img flex">
            <img src="/images/google-play-button.png" alt="Get it on Google Play" />
          </div>
        </div>

        <div className="row row2">
          <div className="app-mockup">
            <div className="phone-frame">
              <div className="phone-screen">
                <div className="phone-header">
                  <img src="/images/logo.png" alt="Resort Logo" className="phone-logo" />
                  <span>Resort App</span>
                </div>
                <div className="phone-content">
                  <img src="/images/resort1.jpg" alt="Resort" className="phone-resort-img" />
                  <div className="phone-card">
                    <p>🏖️ Book Your Stay</p>
                    <p>🍽️ Reserve Dining</p>
                    <p>🎉 Event Packages</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Download
