import React, { useState } from 'react';
import Contact from './Contact';

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState('about');

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 border-b border-secondary/20">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-8 py-3 text-lg font-display font-bold transition-all border-b-2 ${activeTab === 'about'
                ? 'border-primary dark:border-secondary text-primary dark:text-secondary'
                : 'border-transparent text-text-light/60 dark:text-text-dark/60 hover:text-primary dark:hover:text-secondary'
              }`}
          >
            About Us
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-8 py-3 text-lg font-display font-bold transition-all border-b-2 ${activeTab === 'contact'
                ? 'border-primary dark:border-secondary text-primary dark:text-secondary'
                : 'border-transparent text-text-light/60 dark:text-text-dark/60 hover:text-primary dark:hover:text-secondary'
              }`}
          >
            Contact
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'about' && (
          <div className="max-w-4xl mx-auto animate-fadeIn">
            <h1 className="text-primary dark:text-secondary text-4xl font-bold font-display leading-tight tracking-[-0.015em] text-center mb-8">
              Our Story
            </h1>
            <div className="bg-primary/5 dark:bg-secondary/5 rounded-2xl p-8 md:p-10 shadow-sm border border-secondary/10">
              <p className="text-lg md:text-xl leading-relaxed font-body text-text-light dark:text-text-dark text-center mb-6">
                "AJ – Mana Style is a small family-led fashion brand inspired, built for everyday life in India."
              </p>
              <p className="text-base md:text-lg leading-relaxed font-body text-text-light/90 dark:text-text-dark/90 text-justify mb-4">
                We focus on simple, comfortable clothes and shoes that actually work for our weather, crowds and daily routines – from office hours and college to chai breaks, weddings and weekend trips.
              </p>
              <p className="text-base md:text-lg leading-relaxed font-body text-text-light/90 dark:text-text-dark/90 text-justify mb-4">
                Our goal is to bring together good fabrics, clean fits and fair pricing so people can feel confident without trying too hard.
              </p>
              <div className="mt-8 text-center">
                <span className="inline-block px-4 py-2 bg-secondary/20 text-primary dark:text-secondary font-display font-bold text-lg rounded-lg transform -rotate-1">
                  “Mana style” for us means fashion that feels like ours.
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="animate-fadeIn">
            <Contact />
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutUs;
