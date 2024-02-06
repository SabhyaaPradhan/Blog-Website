import React, { useState } from 'react';
import { Carousel } from 'react-bootstrap';
import './WelcomeSlideshow.css';

function WelcomeSlideshow() {
  const slides = [
    "BlogBursts is your digital gateway to sustainable living and environmental exploration. As a comprehensive platform dedicated to eco-conscious living, this website offers a treasure trove of articles, guides, and resources on sustainable practices, green innovations, and mindful living.",
    "From practical tips on reducing your carbon footprint to in-depth features on biodiversity and conservation efforts, EcoExplorers.com is your go-to destination for all things environmentally conscious. Engage with our community, discover actionable insights, and embark on a journey towards a greener and more sustainable lifestyle. Join us at BlogBursts and let's explore a world where sustainability meets inspiration!",
  ];

  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect} slide={false}>
      {slides.map((slide, idx) => (
        <Carousel.Item key={idx} className="carousel-item">
          <Carousel.Caption>
            <h3>{"Get Started with BlogBursts"}</h3>
            <p>{slide}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default WelcomeSlideshow;
