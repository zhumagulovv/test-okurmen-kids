import { SKILL_CATEGORIES } from "../../constants/constants"

const Categories = () => {

    return (
        <section className="max-w-7xl mx-auto w-full px-6 mb-24 mt-12">
            <h3 className="font-headline text-2xl font-bold text-(--on-surface) mb-6">Категории навыков</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {
                    SKILL_CATEGORIES.map((category, index) => {
                        const Icon = category.icon
                        return (
                            <div
                                key={index}
                                className="aspect-square bg-(--surface-container-lowest) rounded-xl p-6 flex flex-col justify-center items-center text-center hover:bg-surface-container-high transition-colors cursor-pointer">
                                <div className="w-25 h-25 rounded-full bg-[#fcc025]/20 flex items-center justify-center mb-4">
                                    <Icon className='text-5xl' />
                                </div>
                                <h5 className="font-bold text-(--on-surface)">{category.title}</h5>
                                <p className="text-xs text-(--on-surface-variant) mt-2">{category.description}</p>
                            </div>
                        )
                    })
                }
            </div>
        </section>
    )
}

export default Categories
