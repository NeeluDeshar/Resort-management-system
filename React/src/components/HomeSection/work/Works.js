import React from "react"
import "./Works.css"

const steps = [
  {
    id: 1,
    icon: "fas fa-search",
    title: "Search & Explore",
    desc: "Browse our available rooms, event venues, and resort amenities. Filter by dates, guests, and preferences to find your perfect stay.",
  },
  {
    id: 2,
    icon: "fas fa-calendar-check",
    title: "Choose & Book",
    desc: "Select your preferred room or package, pick your dates, and fill in your details. Our secure booking process takes just a few minutes.",
  },
  {
    id: 3,
    icon: "fas fa-credit-card",
    title: "Confirm & Pay",
    desc: "Review your booking summary and complete your payment securely. You'll receive an instant confirmation to your email.",
  },
  {
    id: 4,
    icon: "fas fa-umbrella-beach",
    title: "Arrive & Enjoy",
    desc: "Check in at the resort and let us take care of everything. Relax, explore, and create unforgettable memories with your loved ones.",
  },
]

const Works = () => {
  return (
    <section className="works-section top">
      <div className="container">
        <div className="heading">
          <h1>How It Works</h1>
          <div className="line"></div>
          <p className="works-subtitle">Your dream resort experience in four simple steps</p>
        </div>

        <div className="works-steps">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="works-card">
                <div className="works-step-number">{step.id}</div>
                <div className="works-icon-wrap">
                  <i className={step.icon}></i>
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="works-connector">
                  <i className="fas fa-chevron-right"></i>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="works-cta">
          <a href="/room" className="primary-btn">Book Your Stay Now</a>
        </div>
      </div>
    </section>
  )
}

export default Works
