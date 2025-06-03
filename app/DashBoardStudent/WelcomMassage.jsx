"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FiArrowLeft, FiArrowRight, FiSettings, FiCheckCircle, FiUsers, FiClock, FiBookOpen, FiX } from "react-icons/fi";
import { useLanguage } from "@/contexts/LanguageContext";

const colors = {
  blue: '#008DCB',
  black: '#0D1012',
  gray: '#999999',
  red: '#E2101E',
  white: '#FFFFFF',
  yellow: '#F9D011'
};

const WelcomeMessage = () => {
  const { t, language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showFeatures, setShowFeatures] = useState(false);

  // بيانات الشرائح مع الترجمة
  const slides = [
    {
      image: "https://media.istockphoto.com/id/1446806057/es/foto/joven-estudiante-feliz-usando-computadora-port%C3%A1til-viendo-webinar-escribiendo-en-casa.jpg?s=612x612&w=0&k=20&c=eAEreJw-5Uerr2vDkFTQLgPGacbdZZDq7xpqrSTJ71A=",
      alt : "Slide",
      title: t?.slides?.[0]?.title,
      description: t?.slides?.[0]?.description,
      cta: t?.slides?.[0]?.cta,
      icon: <FiUsers style={{ color: colors.blue }} className={language === 'ar' ? "ml-2" : "mr-2"} />
    },
    {
      image: "https://media.istockphoto.com/id/1490133656/es/foto/mujer-joven-usando-un-port%C3%A1til-mientras-trabaja-desde-casa.jpg?s=612x612&w=0&k=20&c=e9B2HwTUxZMLkNIQdE88e5eFOBBPZJK-zDDb53W9CxE=",
            alt : "Slide",

      title: t?.slides?.[1]?.title,
      description: t?.slides?.[1]?.description,
      cta: t?.slides?.[1]?.cta,
      icon: <FiBookOpen style={{ color: colors.blue }} className={language === 'ar' ? "ml-2" : "mr-2"} />
    },
  ];

  // بيانات الميزات مع الترجمة
  const features = [
    {
      icon: <FiUsers style={{ color: colors.blue }} className="w-12 h-12 mb-4" />,
      title: t?.features?.[0]?.title,
      description: t?.features?.[0]?.description
    },
    {
      icon: <FiCheckCircle style={{ color: colors.red }} className="w-12 h-12 mb-4" />,
      title: t?.features?.[1]?.title,
      description: t?.features?.[1]?.description
    },
    {
      icon: <FiClock style={{ color: colors.yellow }} className="w-12 h-12 mb-4" />,
      title: t?.features?.[2]?.title,
      description: t?.features?.[2]?.description
    },
    {
      icon: <FiSettings style={{ color: colors.gray }} className="w-12 h-12 mb-4" />,
      title: t?.features?.[3]?.title,
      description: t?.features?.[3]?.description
    }
  ];

  const nextSlide = () => {
    setDirection(language === 'ar' ? -1 : 1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(language === 'ar' ? 1 : -1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [currentSlide, language]);

  return (
    <div 
      className="flex flex-col items-center w-full max-w-7xl mx-auto px-0 py-10 min-h-[80vh] relative overflow-hidden"
      style={{ 
        backgroundColor: colors.white,
        direction: language === 'ar' ? 'rtl' : 'ltr'
      }}>
      
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-yellow-50/80 backdrop-blur-xl"></div>
        <div className="absolute inset-0 opacity-10 bg-slate-500 mix-blend-overlay"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full flex items-center gap-6 mb-8 md:mb-12 relative group"
      >
        <div className="relative flex-shrink-0">
          <motion.div 
            className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform perspective-[1000px] hover:rotate-[-3deg] hover:scale-105 transition-all duration-300"
            style={{ borderColor: colors.white }}
            whileHover={{ rotateY: language === 'ar' ? -10 : 10 }}
          >
            <Image
              src="https://static.vecteezy.com/system/resources/thumbnails/017/202/446/small/animated-man-comes-up-with-idea-video.jpg"
  alt={t?.altTexts?.user || 'User Profile'} // ✅ Fallback added
              width={100}
              height={100}
              className="w-24 h-24 object-cover"
              priority
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-yellow-500/20 mix-blend-overlay rounded-2xl" />
        </div>
        
        <div className="flex flex-col space-y-2">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent"
            style={{ backgroundImage: `linear-gradient(to right, ${colors.blue}, ${colors.black})` }}
          >
            {t?.welcome?.title}
            <br />
            <span className="inline-block relative">
              {t?.userName}
              <motion.span
                className="absolute -bottom-1 left-0 w-full h-1"
                style={{ background: colors.yellow }}
              />
            </span>
          </motion.h2>
          <motion.p 
            className="text-lg md:text-xl"
            style={{ color: colors.gray }}
          >
            {t?.welcome?.subtitle}
          </motion.p>
        </div>
      </motion.div>

      <div className="relative w-full max-w-6xl group h-[450px] overflow-hidden">
        <motion.button
          onClick={prevSlide}
          className={`absolute ${language === 'ar' ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 z-20 p-4 rounded-full shadow-xl hover:shadow-2xl transform transition-all duration-300`}
          style={{ backgroundColor: colors.white }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {language === 'ar' ? 
            <FiArrowRight className="w-8 h-8" style={{ color: colors.blue }} /> : 
            <FiArrowLeft className="w-8 h-8" style={{ color: colors.blue }} />}
        </motion.button>

        <motion.button
          onClick={nextSlide}
          className={`absolute ${language === 'ar' ? 'left-6' : 'right-6'} top-1/2 -translate-y-1/2 z-20 p-4 rounded-full shadow-xl hover:shadow-2xl transform transition-all duration-300`}
          style={{ backgroundColor: colors.white }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {language === 'ar' ? 
            <FiArrowLeft className="w-8 h-8" style={{ color: colors.blue }} /> : 
            <FiArrowRight className="w-8 h-8" style={{ color: colors.blue }} />}
        </motion.button>

        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            initial={{ opacity: 0, x: language === 'ar' ? direction * 100 : -direction * 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: language === 'ar' ? -direction * 100 : direction * 100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute w-full h-full top-0 left-0"
          >
            <div className="flex flex-col md:flex-row items-center rounded-3xl overflow-hidden shadow-2xl border h-full"
                 style={{ 
                   background: `linear-gradient(to bottom right, ${colors.white}, ${colors.blue}10)`,
                   borderColor: colors.blue + '20'
                 }}>
              <div className="relative w-full md:w-1/2 h-80 md:h-full">
                <Image
                  src={slides[currentSlide].image}
  alt={t?.altTexts?.user || 'User Profile'} // ✅ Fallback added
                  fill
                  className="object-cover object-center transform scale-105 hover:scale-100 transition-transform duration-500 ease-out"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-12 space-y-6">
                <motion.div>
                  <div className="inline-flex items-center gap-2 mb-4">
                    {slides[currentSlide].icon}
                    <span className="text-sm font-semibold" style={{ color: colors.blue }}>
                      {t?.slides?.newTag}
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold leading-tight" style={{ color: colors.black }}>
                    {slides[currentSlide].title}
                  </h3>
                </motion.div>

                <motion.p
                  className="text-lg md:text-xl leading-relaxed"
                  style={{ color: colors.gray }}
                >
                  {slides[currentSlide].description}
                </motion.p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 px-8 py-4 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-lg"
                  style={{ background: colors.blue }}
                  onClick={() => setShowFeatures(true)}
                >
                  {slides[currentSlide].icon}
                  {slides[currentSlide].cta}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-500 ease-out ${
                currentSlide === index 
                  ? "w-8 bg-gradient-to-r from-blue-500 to-yellow-500"
                  : "w-4 bg-gray-200 hover:bg-gray-300"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showFeatures && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-lg z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="rounded-2xl shadow-2xl max-w-4xl w-full p-8 relative"
              style={{ backgroundColor: colors.white }}
            >
              <button
                onClick={() => setShowFeatures(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FiX className="w-6 h-6" style={{ color: colors.gray }} />
              </button>

              <h3 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(to right, ${colors.blue}, ${colors.black})` }}>
                {t?.featuresTitle}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-xl p-6 transition-colors border hover:border-blue-200"
                    style={{ 
                      backgroundColor: colors.white,
                      borderColor: colors.blue + '20',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                    }}
                  >
                    <div className="flex flex-col items-center text-center">
                      {feature.icon}
                      <h4 className="text-xl font-semibold mb-2" style={{ color: colors.black }}>
                        {feature.title}
                      </h4>
                      <p className="text-gray-600" style={{ color: colors.gray }}>
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: colors.yellow,
                    color: colors.black
                  }}
                  onClick={() => setShowFeatures(false)}
                >
                  {t?.buttons?.getStarted}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WelcomeMessage;