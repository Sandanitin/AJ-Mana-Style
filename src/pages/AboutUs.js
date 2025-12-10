import React from 'react';

const AboutUs = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-primary dark:text-secondary text-4xl font-bold font-display leading-tight tracking-[-0.015em] text-center mb-8">
          About AJ – Mana Style
        </h1>
        
        <div className="space-y-6 font-body text-text-light dark:text-text-dark">
          <p className="text-lg leading-relaxed">
            AJ – Mana Style is a small family-led fashion brand built for everyday life in India. 
            We focus on simple, comfortable clothes and shoes that actually work for our weather, 
            crowds, and daily routines.
          </p>
          
          <p className="leading-relaxed">
            From office hours and college to chai breaks, weddings, and weekend trips, our designs 
            blend ease with elegance. Our goal is to bring together good fabrics, clean fits, and 
            fair pricing so people can feel confident without trying too hard.
          </p>
          
          <div className="bg-primary/5 dark:bg-secondary/5 p-6 rounded-lg">
            <h2 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-4">
              What “Mana Style” Means
            </h2>
            <p className="leading-relaxed">
              “Mana Style” for us means fashion that feels like ours — rooted in everyday Indian life, 
              shaped by comfort, simplicity, and personal expression. It’s not just about trends, 
              but about feeling good in what you wear, every single day.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
