import React from 'react';

const AboutUs = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-primary dark:text-secondary text-4xl font-bold font-display leading-tight tracking-[-0.015em] text-center mb-8">
          About Vastrani Looms
        </h1>
        
        <div className="space-y-6 font-body text-text-light dark:text-text-dark">
          <p className="text-lg leading-relaxed">
            Welcome to Vastrani Looms, where tradition meets elegance in every thread we weave. 
            For over three generations, our family has been dedicated to preserving the ancient art 
            of Indian handloom weaving, creating sarees that are not just garments, but pieces of living heritage.
          </p>
          
          <p className="leading-relaxed">
            Founded in 1952 by our grandfather, Vastrani Looms began as a small workshop in the textile-rich 
            region of South India. What started as a passion for craftsmanship has evolved into a legacy 
            that spans decades, touching the lives of thousands of women who have worn our creations on 
            their most special occasions.
          </p>
          
          <div className="bg-primary/5 dark:bg-secondary/5 p-6 rounded-lg">
            <h2 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-4">
              Our Mission
            </h2>
            <p className="leading-relaxed">
              To preserve and celebrate the timeless art of Indian handloom weaving while creating 
              contemporary pieces that honor tradition and embrace modern elegance. Every saree we 
              create tells a story of heritage, craftsmanship, and the skilled hands that bring it to life.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            <div>
              <h3 className="text-xl font-bold font-display text-primary dark:text-secondary mb-3">
                Our Craftsmanship
              </h3>
              <p className="leading-relaxed">
                Each saree is meticulously handwoven using traditional techniques passed down through 
                generations. Our master weavers spend weeks, sometimes months, creating a single piece, 
                ensuring every thread is placed with precision and care.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold font-display text-primary dark:text-secondary mb-3">
                Sustainable Practices
              </h3>
              <p className="leading-relaxed">
                We are committed to ethical and sustainable practices, working directly with local 
                artisans and ensuring fair wages. Our materials are sourced responsibly, supporting 
                traditional silk farmers and cotton growers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;