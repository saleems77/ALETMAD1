import React from 'react'
import Header from './Header'
import WelcomMassage from './WelcomMassage'
import LearningGoals from './components/LearningGoals'
import PricingPlans from './components/PricingPlans'
import PopularAndCaseStudy from './components/PopularAndCaseStudy'
import TestimonialsAndReport from './components/TestimonialsAndReport'
import Courses from './Courses'
import Footer from '@/components/Footer';

function page() {
  return (
    <div>
      <Header/>
<div className="pt-20">      <WelcomMassage/>
</div>
<div className="px-0">
<Courses/>
</div>

      <LearningGoals/>
      <PricingPlans/>
      <TestimonialsAndReport/>
      <PopularAndCaseStudy/>
      <Footer />

    </div>
  )
}

export default page
