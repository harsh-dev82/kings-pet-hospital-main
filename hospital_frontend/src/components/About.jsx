import React from 'react';

const team = [
  {
    name: 'Dr. Mohit Bazzad',
    role: 'B.VSC.& AH,PGCCVH',
    imageUrl: '51.jpg',
  },
  {
    name: 'Dr. Manju',
    role: 'General Physician',
    imageUrl: '56.jpg',
  },
  
];

const About = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">About Kings Pet Hospital</h2>
            <p className="text-lg text-gray-600 mb-4">
              We are a modern, compassionate veterinary hospital dedicated to the lifelong well-being
              of your pets. Since 2019, we have provided advanced medical care, grooming, diagnostics,
              and rehabilitation under one roof.
            </p>
            <p className="text-gray-600">
              Our facility features state-of-the-art surgical suites, in-house diagnostics, and a caring team
              of professionals. We emphasize preventive care and personalized treatment plans so every pet gets
              the attention they deserve.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-blue-600">14+</p>
                <p className="text-sm text-gray-600">Years of Care</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-blue-600">10k+</p>
                <p className="text-sm text-gray-600">Happy Pets</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-blue-600">4.9★</p>
                <p className="text-sm text-gray-600">Customer Rating</p>
              </div>
            </div>
          </div>

          <div className="relative opacity-0 translate-y-4 animate-[fadeIn_0.5s_ease-out_0.2s_forwards]">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="24.jpg"
                alt="Vet examining a dog"
                className="rounded-xl shadow-lg object-cover h-56 w-full"
              />
              <img
                src="20.jpg"
                alt="Happy pet after grooming"
                className="rounded-xl shadow-lg object-cover h-56 w-full"
              />
              <img
                src="18.jpg"
                alt="Modern veterinary equipment"
                className="rounded-xl shadow-lg object-cover h-56 w-full col-span-2"
              />
            </div>
            <div className="absolute -inset-2 -z-10 bg-blue-100/40 rounded-3xl blur-2xl"></div>
          </div>
        </div>

        <div className="animate-[fadeIn_0.5s_ease-out_0.3s_forwards]==]]">
          <h3 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Meet Our Team</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-xl shadow-lg overflow-hidden text-center transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <img src={member.imageUrl} alt={member.name} className="w-full object-center" />
                <div className="p-6">
                  <h4 className="text-xl font-semibold text-gray-800">{member.name}</h4>
                  <p className="text-blue-600 font-medium mt-1">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;


