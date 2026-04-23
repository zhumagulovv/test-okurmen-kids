import { useEffect, useRef, useState } from "react"
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr"

import { SLIDES } from "../../constants/constants"

export default function ProCarousel() {
    const [index, setIndex] = useState(0)
    const startX = useRef(0)
    const endX = useRef(0)

    // AUTO SLIDER
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % SLIDES.length)
        }, 4000)

        return () => clearInterval(interval)
    }, [])

    const nextSlide = () =>
        setIndex((prev) => (prev + 1) % SLIDES.length)

    const prevSlide = () =>
        setIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)

    // SWIPE
    const handleTouchStart = (e) => {
        startX.current = e.touches[0].clientX
    }

    const handleTouchEnd = (e) => {
        endX.current = e.changedTouches[0].clientX

        const diff = startX.current - endX.current

        if (diff > 50) nextSlide()
        if (diff < -50) prevSlide()
    }

    return (
        <div
            className="relative overflow-hidden rounded-xl mb-12 min-h-75 md:min-h-105 bg-linear-to-br from-(--primary) to-(--primary-container) text-(--on-primary)"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* TRACK */}
            <div
                className="flex h-full items-center transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${index * 100}%)` }}
            >
                {SLIDES.map((slide, i) => (
                    <div
                        key={i}
                        className="min-w-full h-full flex flex-col md:flex-row items-center justify-center gap-8 p-6 md:p-12"
                    >
                        {/* TEXT */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 mb-4">
                                <span className="text-xs font-bold uppercase">
                                    {slide.tag}
                                </span>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
                                {slide.title}
                            </h2>

                            <p className="text-base md:text-lg opacity-90 max-w-xl mx-auto md:mx-0">
                                {slide.description}
                            </p>
                        </div>

                        {/* IMAGE */}
                        <div className="flex-1 flex justify-center">
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-36 md:w-52 h-36 md:h-52 object-contain"
                                loading="lazy"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* BUTTONS */}
            <button
                onClick={prevSlide}
                className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 transition px-3 py-3 rounded-full"
            >
                <GrFormPreviousLink className="text-2xl" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 transition px-3 py-3 rounded-full"
            >
                <GrFormNextLink className="text-2xl" />
            </button>

            {/* DOTS */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {SLIDES.map((_, i) => (
                    <div
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full cursor-pointer transition ${i === index ? "bg-white" : "bg-white/40"
                            }`}
                    />
                ))}
            </div>
        </div>
    )
}