import React,{useState, useEffect} from "react"
import "./Singlepages.css"
import HeadTitle from "../common/HeadTitle/HeadTitle"
import { Link } from "react-router-dom"
import { useParams } from "react-router-dom"
import Sdata from "../components/Features/Sdata"
import EmptyFile from "../common/Empty/EmptyFile"

const SinglePages = () => {
    const {id} = useParams()
    const [item,setItem] = useState(null)

    useEffect(() => {
      const item = Sdata.find((item) => item.id === parseInt(id))
      if (item) {
        setItem(item)
      }
    
     }, [id])
    
  return (
    <>
    <HeadTitle />
    {item ? (
    <section className='single-page top'>
        <div className='container'>
            <Link to='/features' className='primary-btn back'>
            <i className='fas fa-long-arrow-alt-left'></i> Go Back
            </Link>

            <article className='content flex'>
                <div className='main-content'>
    
                    <img src={item.image} alt='' />
                    <p>{item.desc}</p>
                    <p>{item.desc}</p>
           


                    <div className='para flex_space'>
                      <p>{item.sidepara}</p>
                      <p>{item.sidepara}</p>
                    </div>
                    <h1>What is the {item.title} theme?</h1>
                    <p>{item.desc}</p>
                    <div className='image grid1'>
                      <img src={item.paraImage_one} alt='' />
                      <img src={item.paraImage_two} alt='' />
                    </div>
                    <p>{item.desc}</p>
                    <p>{item.desc}</p>

                </div>
                <div className="side-content">
                  <div className="box">
                    <h2>How can we help you?</h2>
                    <p>{item.sidepara}</p>
                    <button className='outline-btn'>
                      <i className='fa fa-phone-alt'></i>
                      Contact Us
                    </button>
                  </div>


                  <div className="box2">
                    <p>{item.sidepara}</p>
                  </div>


                </div>
            </article>
        </div>
    </section>
    ) : (
        <EmptyFile />
    )}
    </>
  )
}

export default SinglePages