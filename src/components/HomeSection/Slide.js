import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Home.css";


const Slide = ({ slides }) => {
  const [current, setCurrent] = useState(0);
  const length = slides.length;

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(slides) || slides.length <= 0) {
    return null;
  }

  return (
    <section className="slider">
      <div className="control-btn">
        <button className="prev" onClick={prevSlide} aria-label="Previous slide">
          <i className="fas fa-caret-left"></i>
        </button>
        <button className="next" onClick={nextSlide} aria-label="Next slide">
          <i className="fas fa-caret-right"></i>
        </button>
      </div>

      {slides.map((slide, index) => (
        <div
          className={index === current ? "slide active" : "slide"}
          key={index}
        >
          {index === current && (
            <img
              src={slide.images}
              alt={slide.description || `Slide ${index + 1}`}
            />
          )}
        </div>
      ))}
    </section>
  );
};

// Add PropTypes for validation
Slide.propTypes = {
  slides: PropTypes.arrayOf(
    PropTypes.shape({
      images: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ).isRequired,
};

export default Slide;
