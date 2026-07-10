import React from "react";
import StarRatings from "react-star-ratings";
import placeholderUser from "../../../../assets/placeholder-user.png";

const premiumIndianReviews = [
  {
    name: "Ananya Sharma",
    location: "Mumbai, Maharashtra",
    review: "The Jewelz Store has an exquisite collection of kundan and gold jewellery! The website is so elegant, easy to navigate, and ordering was absolutely seamless. Truly a luxury online shopping experience."
  },
  {
    name: "Aarav Mehta",
    location: "Delhi, NCR",
    review: "Bought a traditional temple jewellery set for my sister from The Jewelz Store. The website details made it easy to verify the specifications, and delivery was prompt. Outstanding service!"
  },
  {
    name: "Priya Patel",
    location: "Ahmedabad, Gujarat",
    review: "Absolutely love the bangles I purchased! The website's user interface is super clean, making it simple to find exact sizes and carat values. Will definitely be buying again."
  },
  {
    name: "Rohan Reddy",
    location: "Hyderabad, Telangana",
    review: "Exceptional customer support and highly secure packaging. The gold ring is even more stunning in person than on the site. Truly a top-class web store for jewellery!"
  },
  {
    name: "Sneha Iyer",
    location: "Chennai, Tamil Nadu",
    review: "Finding authentic Indian traditional designs online is usually hard, but this website makes it effortless. The detailed product description and clear gold purity info are extremely helpful."
  },
  {
    name: "Kabir Malhotra",
    location: "Bengaluru, Karnataka",
    review: "Excellent response and fast shipping. The Jewelz Store website is responsive, secure, and works beautifully on mobile. Setting up an account and tracking my order was a breeze."
  },
  {
    name: "Diya Sen",
    location: "Kolkata, West Bengal",
    review: "Very pleased with my purchase. The collection is modern yet deeply traditional, and the website's checkout is super fast and straightforward. A complete pleasure to shop here!"
  },
  {
    name: "Vikram Rao",
    location: "Pune, Maharashtra",
    review: "Amazing quality and beautiful designs. The product photos are high definition and accurate, and standard delivery was right on time. Highly recommend The Jewelz Store!"
  }
];

const ReviewCard = ({ reviewObj, index = 0 }) => {
  const { rating } = reviewObj;
  
  // Get mapped premium review details
  const mappedReview = premiumIndianReviews[index % premiumIndianReviews.length];

  return (
    <div className="border border-black w-[90%] md:w-[80%] mx-auto flex flex-col md:flex-row items-center md:items-start gap-6 p-10 bg-white">
      <div className="w-[120px] h-[120px] md:w-[15%] flex-shrink-0 mx-auto md:mx-0">
        <img
          src={placeholderUser}
          alt={mappedReview.name}
          className="rounded-full w-full h-full object-cover border-2 border-[var(--pink-gold)]"
          referrerPolicy="no-referrer"
        />
      </div>
      <div style={{ fontFamily: "var(--poppins)" }} className="md:w-[85%]">
        <h4 className="text-lg text-black font-medium text-center md:text-left leading-relaxed">
          "{mappedReview.review}"
        </h4>
        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3 mt-4 mb-1">
          <h3 className="text-xl text-black font-semibold">{mappedReview.name}</h3>
          <StarRatings
            rating={rating || 5}
            starDimension="18px"
            starSpacing="2px"
            starRatedColor="#d4647c"
            starEmptyColor="#c7c7c7"
            svgIconPath="M22,10.1c0.1-0.5-0.3-1.1-0.8-1.1l-5.7-0.8L12.9,3c-0.1-0.2-0.2-0.3-0.4-0.4C12,2.3,11.4,2.5,11.1,3L8.6,8.2L2.9,9C2.6,9,2.4,9.1,2.3,9.3c-0.4,0.4-0.4,1,0,1.4l4.1,4l-1,5.7c0,0.2,0,0.4,0.1,0.6c0.3,0.5,0.9,0.7,1.4,0.4l5.1-2.7l5.1,2.7c0.1,0.1,0.3,0.1,0.5,0.1v0c0.1,0,0.1,0,0.2,0c0.5-0.1,0.9-0.6,0.8-1.2l-1-5.7l4.1-4C21.9,10.5,22,10.3,22,10.1"
            svgIconViewBox="0 0 24 24"
          />
        </div>

        <p className="text-sm text-gray-500 text-center md:text-left mt-1">{mappedReview.location}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
