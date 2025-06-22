"use client"
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import AdStatusBadge from './AdStatusBadge';
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from 'lucide-react';

const PromotedCourseBanner = ({ campaigns }) => {
  if (!campaigns || campaigns.length === 0) return null;

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-hard">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        showArrows={true}
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="absolute right-6 top-1/2 z-10 p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-hard transform -translate-y-1/2"
            >
              <ChevronRight className="w-8 h-8 text-gray-900" />
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="absolute left-6 top-1/2 z-10 p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-hard transform -translate-y-1/2"
            >
              <ChevronLeft className="w-8 h-8 text-gray-900" />
            </button>
          )
        }
      >
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="relative h-[400px] md:h-[500px]">
            {campaign.bannerImage ? (
              <img 
                src={campaign.bannerImage}
                className="object-cover w-full h-full"
                alt={campaign.title}
              />
            ) : (
              <div className="bg-gray-200 border-2 border-dashed border-gray-300 w-full h-full flex items-center justify-center">
                <span className="text-gray-500">لا يوجد صورة</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-6">
                <div className="space-y-4 text-white">
                  <div className="flex items-center gap-4">
                    <AdStatusBadge status={campaign.status} />
                    <div className="flex items-center gap-2 text-yellow-400">
                      <Star className="w-6 h-6 fill-current" />
                      <span className="text-xl">4.9</span>
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold">{campaign.title}</h3>
                  <p className="text-gray-200">{campaign.description}</p>
                </div>
                <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-xl text-base md:text-lg font-medium flex items-center gap-2 self-start mt-4 lg:mt-0">
                  <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
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