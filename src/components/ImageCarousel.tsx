'use client';

import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Import icons

const ImageCarousel = () => {
  return (
    <div
      className="w-full h-[400px] flex items-center justify-center mx-auto"
      style={{ maxWidth: '84rem' }}
    >
      <Carousel
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        autoPlay
        interval={3000}
        emulateTouch
        stopOnHover
        showArrows
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white text-black w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-purple-200 transition z-20"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-black w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-purple-200 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )
        }
      >
        {['/1.png', '/2.png', '/3.png'].map((src, index) => (
          <div key={index}>
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className="w-screen h-[400px] object-cover"
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
