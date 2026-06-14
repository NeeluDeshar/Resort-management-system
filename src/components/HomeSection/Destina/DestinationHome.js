import React from "react"
import AllItems from "../../Features/AllItems"
import "../popular/MostPopular.css"

const DestinationHome = () => {
  return (
  <>
  <section className='popular top'>
    <div className='full container'>
        <div className='heading'>
            <h1>Most Popular Features</h1>
            <div className='line'></div>
        </div>
        <div className='content'>
            <AllItems />
        </div>

    </div>
  </section>
  </>
  )
}

export default DestinationHome