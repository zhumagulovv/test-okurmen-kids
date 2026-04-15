import React from 'react'
import { FaPython } from 'react-icons/fa'
import { IoLogoJavascript } from 'react-icons/io'
import { TiHtml5 } from 'react-icons/ti'

const Categories = () => {
    return (
        <section className="max-w-7xl mx-auto w-full px-6 mb-24 mt-12">
            <h3 className="font-headline text-2xl font-bold text-color-two mb-6">Категории навыков</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                <div
                    className="aspect-square second-background-color rounded-xl p-6 flex flex-col justify-center items-center text-center hover:bg-surface-container-high transition-colors cursor-pointer">
                    <div className="w-16 h-16 rounded-full bg-[#fcc025]/20 flex items-center justify-center mb-4">
                        <TiHtml5 className='text-4xl' />
                    </div>
                    <h5 className="font-bold text-color-two">HTML &amp; CSS</h5>
                    <p className="text-xs text-color-three mt-2">12 модулей</p>
                </div>
                <div
                    className="aspect-square second-background-color rounded-xl p-6 flex flex-col justify-center items-center text-center hover:bg-surface-container-high transition-colors cursor-pointer">
                    <div className="w-16 h-16 rounded-full bg-[#6a37d4]/20 flex items-center justify-center mb-4">
                        <IoLogoJavascript className='text-3xl' />
                    </div>
                    <h5 className="font-bold text-color-two">JavaScript</h5>
                    <p className="text-xs text-color-three mt-2">8 модулей</p>
                </div>
                <div
                    className="aspect-square second-background-color rounded-xl p-6 flex flex-col justify-center items-center text-center hover:bg-surface-container-high transition-colors cursor-pointer">
                    <div className="w-16 h-16 rounded-full bg-[#0057bd]/20 flex items-center justify-center mb-4">
                        <FaPython className='text-3xl'/>
                    </div>
                    <h5 className="font-bold text-color-two">Python</h5>
                    <p className="text-xs text-color-three mt-2">15 модулей</p>
                </div>
            </div>
        </section>
    )
}

export default Categories
