import React from 'react'
import HeadTitle from '../../common/HeadTitle/HeadTitle'
import AboutCard from './AboutCard'
import { Link } from 'react-router-dom'

const About = () => {
  return (
    <>
    <HeadTitle />
    <section className='about top'>
        <div className="container">
            <AboutCard showButton={false} />
        </div>
    </section>
    <section className='features top'>
      <div className='container aboutCard flex_space'>
        <div className='row row1'>
          <h1>
            Our <span>Features</span>
          </h1>
          <p>Lorem ipsum dolor sit amet con</p>
          <p>Lorem ipsum dolor sit amet con</p>
          <Link to='/features'>
            <button className='secondary-btn'>
              Explore More <i className='fas fa-long-arrow-alt-right'></i>
            </button>
          </Link>
        </div>
        <div className='row image'>
          <img src='/images/photo3.jpg' alt=''/>
          <div className='control-btn'>
            <button className='prev'>
            <i className='fas fa-play'></i>
            </button>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}

export default About
