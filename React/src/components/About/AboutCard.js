import React from "react"
import { Link } from "react-router-dom"
import "./About.css"

const AboutCard = ({ showButton = true }) => {
  return (
    <div className="aboutCard mtop flex_space">
      <div className="row row1">
        <h4>About Us</h4>
        <h1>
          We <span>provide Solution</span> to grow your business
        </h1>
        <p>Lorem ipsum dolor sit amet consectetur adipiscing elit. We are committed to delivering exceptional resort experiences tailored to every guest.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Our team works around the clock to ensure your comfort and satisfaction.</p>
        {showButton && (
          <Link to="/about">
            <button className="secondary-btn">
              Explore More <i className="fas fa-long-arrow-alt-right"></i>
            </button>
          </Link>
        )}
      </div>
      <div className="row image">
        <img src="/images/about-img-1.jpg" alt="About Resort" />
        <div className="control-btn">
          <button className="prev">
            <i className="fas fa-play"></i>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AboutCard
