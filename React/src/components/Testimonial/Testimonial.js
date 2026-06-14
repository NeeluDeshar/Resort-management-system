import React from "react"
import HeadTitle from "../../common/HeadTitle/HeadTitle"
import "./Testimonial.css"

const reviews = [
  {
    id: 1,
    name: "Aarav Sharma",
    role: "Honeymoon Guest",
    image: "/images/profile1.jpg",
    rating: 5,
    text: "Absolutely breathtaking experience. The staff went above and beyond to make our honeymoon unforgettable. The room was spotless and the views were stunning.",
  },
  {
    id: 2,
    name: "Priya Thapa",
    role: "Birthday Celebration",
    image: "/images/profile2.jpg",
    rating: 5,
    text: "We hosted my mother's 60th birthday here and it was perfect. The event team handled every detail beautifully. Highly recommend the birthday package!",
  },
  {
    id: 3,
    name: "Rajesh Poudel",
    role: "Business Seminar",
    image: "/images/profile1.jpg",
    rating: 4,
    text: "Excellent facilities for our corporate seminar. The AV setup was top-notch and the catering team kept everyone well fed throughout the day.",
  },
  {
    id: 4,
    name: "Sita Gurung",
    role: "Wedding Guest",
    image: "/images/profile2.jpg",
    rating: 5,
    text: "One of the most beautiful wedding venues I have ever attended. The decorations, food, and service were all exceptional. A truly magical day.",
  },
  {
    id: 5,
    name: "Bikash Karki",
    role: "Adventure Package",
    image: "/images/profile1.jpg",
    rating: 4,
    text: "The adventure activities were thrilling and well organised. Our guide was knowledgeable and made sure everyone was safe while having a great time.",
  },
  {
    id: 6,
    name: "Manisha Rai",
    role: "Dining Experience",
    image: "/images/profile2.jpg",
    rating: 5,
    text: "The fine dining experience here is unmatched in the region. Fresh ingredients, creative presentation, and a warm atmosphere. We will definitely be back.",
  },
]

const Stars = ({ count }) => (
  <div className="testimonial-stars">
    {Array.from({ length: 5 }).map((_, i) => (
      <i key={i} className={`fas fa-star ${i < count ? "star--filled" : "star--empty"}`}></i>
    ))}
  </div>
)

const Testimonial = () => {
  return (
    <>
      <HeadTitle />
      <section className="testimonial-page top">
        <div className="container">
          <div className="testimonial-intro">
            <h2>What Our Guests Say</h2>
            <p>Real experiences from real guests. We take pride in every stay, celebration, and event we host.</p>
          </div>

          <div className="testimonial-grid">
            {reviews.map((r) => (
              <div className="testimonial-card" key={r.id}>
                <div className="testimonial-card__top">
                  <img src={r.image} alt={r.name} className="testimonial-card__avatar" />
                  <div>
                    <h4 className="testimonial-card__name">{r.name}</h4>
                    <span className="testimonial-card__role">{r.role}</span>
                  </div>
                </div>
                <Stars count={r.rating} />
                <p className="testimonial-card__text">"{r.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Testimonial
