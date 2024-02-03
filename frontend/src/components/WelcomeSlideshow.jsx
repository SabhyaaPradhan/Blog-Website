import React, { useState } from 'react';
import { Carousel } from 'react-bootstrap';

const ExampleCarouselImage = ({ text }) => (
  <img
    className="d-block w-100"
    src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE_xkoB2ANYoNsWSeGY0uuCebU0VCc_zeidxKoFdru8rpwhpgOKaLVnZi1Fn-PaXBxiRI&usqp=CAU"}
    alt={text}
  />
);

function WelcomeSlideshow() {
  const slides = [
    " From the rise of artificial intelligence to the impact of augmented reality, we'll delve into the latest trends shaping the digital world. Get ready to navigate the future and discover how these advancements are influencing our daily lives.",
    "Embark on a captivating visual journey celebrating the rich tapestry of global cultures through art. This slide show will showcase stunning pieces from various corners of the world, highlighting the diversity of artistic expression. From traditional techniques to modern interpretations, immerse yourself in the beauty that transcends borders and connects us all.",
  ];

  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect} slide={false}>
      {slides.map((slide, idx) => (
        <Carousel.Item key={idx} style={{ height: '400px' }}>
          <ExampleCarouselImage text={"Navigating the Digital Age: Embracing the Latest Tech Trends"} />
          <Carousel.Caption>
            <h3>{"Navigating the Digital Age: Embracing the Latest Tech Trends"}</h3>
            <p>{slide}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default WelcomeSlideshow;
