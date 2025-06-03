"use client"
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import AdStatusBadge from './AdStatusBadge';
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from 'lucide-react';

const PromotedCourseBanner = ({ campaigns }) => {
  return (
    <div className="relative rounded-3xl overflow-hidden shadow-hard">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        renderArrowPrev={(onClick) => (
          <button
            onClick={onClick}
            className="absolute right-6 top-1/2 z-10 p-3 bg-light/90 backdrop-blur-sm rounded-xl shadow-hard"
          >
            <ChevronRight className="w-8 h-8 text-dark" />
          </button>
        )}
        renderArrowNext={(onClick) => (
          <button
            onClick={onClick}
            className="absolute left-6 top-1/2 z-10 p-3 bg-light/90 backdrop-blur-sm rounded-xl shadow-hard"
          >
            <ChevronLeft className="w-8 h-8 text-dark" />
          </button>
        )}
      >
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="relative h-[600px]">
            <img 
              src={campaign.bannerImage}
              className="object-cover w-full h-full"
              alt={campaign.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-8">
                <div className="space-y-6 text-light">
                  <div className="flex items-center gap-4">
                    <AdStatusBadge status={campaign.status} />
                    <div className="flex items-center gap-2 text-secondary">
                      <Star className="w-6 h-6 fill-current" />
                      <span className="text-xl">4.9</span>
                    </div>
                  </div>
                  <h3 className="text-4xl font-bold">{campaign.title}</h3>
                  <p className="text-lg text-neutral/80">{campaign.description}</p>
                </div>
                <button className="bg-secondary hover:bg-secondary/90 text-dark px-8 py-4 rounded-xl text-lg font-medium flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6" />
                  اشترك الآن
                </button>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default PromotedCourseBanner;