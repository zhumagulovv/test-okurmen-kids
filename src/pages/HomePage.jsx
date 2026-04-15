import React from 'react'

import Hero from '../components/hero/Hero'
import ExamComponent from '../components/exam_component/ExamComponent'
import HowItWorks from '../components/works'
import Categories from '../components/categories/Categories'

const HomePage = () => {
    return (
        <main>
            <Hero />
            <ExamComponent />
            <HowItWorks />
            <Categories />
        </main>
    )
}

export default HomePage
