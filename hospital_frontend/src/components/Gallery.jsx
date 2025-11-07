import React, { useState } from 'react';

const defaultMedia = [
  { type: 'image', src: '2.jpg' },
  { type: 'image', src: '4.jpg' },
  { type: 'image', src: '7.jpg' },
  { type: 'image', src: '1.jpg' },
  { type: 'image', src: '15.jpg' },
  { type: 'image', src: '19.jpg' },
  { type: 'image', src: '13.jpg' },
  { type: 'image', src: '22.jpg' },
  {type: 'video', src: '5.mp4' },
  {type: 'video', src: '6.mp4' }, 
  {type: 'video', src: '8.mp4' },
  {type: 'video', src: '9.mp4' },
  {type: 'video', src: '10.mp4' },
  {type: 'video', src: '21.mp4' },
  
];

const Gallery = () => {
  const [mediaItems] = useState(defaultMedia);
  const [showAll, setShowAll] = useState(false);
  const VISIBLE_COUNT = 8;
  const visibleItems = showAll ? mediaItems : mediaItems.slice(0, VISIBLE_COUNT);

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Gallery</h2>
          <p className="text-gray-600">Photos and videos from our hospital and happy patients</p>
        </div>

        

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {visibleItems.map((item, idx) => (
            <div key={idx} className="group relative overflow-hidden rounded-lg shadow hover:shadow-md transition">
              {item.type === 'image' ? (
                <img
                  src={item.src}
                  alt="gallery"
                  loading="lazy"
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <video
                  src={item.src}
                  controls
                  preload="metadata"
                  className="w-full h-56 object-cover"
                />
              )}
            </div>
          ))}
        </div>

        {mediaItems.length > VISIBLE_COUNT && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              {showAll ? 'View Less' : 'View More'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;


