import React from "react"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import PopularData from "./PopData"
import Slider from "react-slick"
import { Link } from "react-router-dom"

const SampleNextArrow = (props) => {
    const {onClick} = props
    return(
        <div className="control-btn" onClick={onClick}>
            <button className='next'>
                <i className='fa fa-long-arrow-alt-right'></i>
            </button>
        </div>
    )
}

const SamplePrevArrow = (props) => {
    const {onClick} = props
    return(
        <div className="control-btn" onClick={onClick}>
            <button className='prev'>
                <i className='fa fa-long-arrow-alt-left'></i>
            </button>
        </div>
    )
}

const Cards = () => {
    var settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 2,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
          {
            breakpoint: 900,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              initialSlide: 2,
            }
          },
        ]
      };
  return (
    <>
    <Slider {...settings}>
    {
        PopularData.map((value) =>{
            return(
       <div className='cards' key={value.id}>
        <Link to={`/booking/${value.id}`} className="popular-card-link">
        <div className='item'>
            <div className='image' style={{ height: "150px", overflow: "hidden" }}>
                <img src={(value.image)} alt={value.name} style={{ width: "100%", height: "150px", objectFit: "cover", display: "block" }} />
                <i className='fas fa-map-marker-alt'>
                <label>{(value.country)}</label>
                </i>
            </div>

            <div className='rate'>
                <i className='fa fa-star'></i>
                <i className='fa fa-star'></i>
                <i className='fa fa-star'></i>
                <i className='fa fa-star'></i>
                <i className='fa fa-star'></i>
            </div>
            <div className='details'>
                <h2 style={{ fontSize: "13px", marginBottom: "10px" }}>{value.name}</h2>
                <div className='boarder'></div>
                <h3 style={{ fontSize: "12px" }}>
                  {value.price} /  <span>Per Night</span>
                </h3>
            </div>
        </div>
        </Link>
       </div>
            )
    })
}
</Slider>
    </>
  )
}

export default Cards
