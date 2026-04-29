import { Outlet } from 'react-router-dom'

import Header from '../header/Header'
import Footer from '../footer/Footer'
import AppInt from '../../AppInt'

const MainLayout = () => {
    return (
        <>
            <AppInt />
            <Header />
            <Outlet />
            <Footer />
        </>
    )
}

export default MainLayout
