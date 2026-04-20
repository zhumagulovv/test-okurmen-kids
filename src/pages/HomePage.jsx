import { useRef } from 'react'

import Hero from '../components/hero/Hero'
import ExamComponent from '../components/exam_component/ExamComponent'
import HowItWorks from '../components/works'
import Categories from '../components/categories/Categories'
import DetailCatalogTest from '../components/detail_catalog_test/DetailCatalogTest'

const HomePage = () => {
    const practiceRef = useRef(null)
    return (
        <main>
            <Hero scroollRef={practiceRef} />
            <ExamComponent />
            <HowItWorks />
            <Categories />
            <DetailCatalogTest scroollRef={practiceRef} />
        </main>
    )
}

export default HomePage
