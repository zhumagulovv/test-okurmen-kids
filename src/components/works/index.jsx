import { TbPlayerPlay } from 'react-icons/tb'

const HowItWorks = () => {
    return (
        <section className="max-w-7xl mx-auto w-full px-6 mb-16" >
            <div className="text-center space-y-8">
                <div className="space-y-2">
                    <h3 className="text-3xl font-bold font-headline text-(--on-surface)">Как это работает</h3>
                    <p className="text-(--on-surface-variant) max-w-lg mx-auto">Впервые на платформе? Посмотрите это краткое руководство, чтобы начать работу.</p>
                </div>
                <div className="max-w-4xl mx-auto relative group">
                    <div
                        className="relative aspect-video rounded-2xl overflow-hidden shadow-xl border-4 borde-(--surface-container-highest) cursor-pointer">
                        <img alt="Platform Guide Thumbnail"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            data-alt="A friendly 3D robot instructor pointing at a laptop screen with a bright digital interface, welcoming classroom environment in background, Pixar style, soft lighting"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUHLqn5RkxUQyqY3BuOIrMsNzn5gZpNarY1niXRtlA4UofFS30b0oIdHupEEfmLxtCOp4SKqJileNQnDlUh-TiyCChbx5O74cIpBwUy_RW6DU8ry3zEoI6Kpfpy-6scdOD-jAMmNf-LEzCDgLN1RM8XEJLMKOu2fZO-UGHEo_ew0RKcUylAE3SomS7IS5Vmxoc6okXWOeQAEtiTCje41LlCHLYCH7-gmXJqpuPRHIA6L-x2GHPtDuH3B5rbglDqgBNkzVfcnjqTE4" />
                        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                            <div
                                className="w-20 h-20 text-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-primary transition-all duration-300 bg-(--primary)/90">
                                <TbPlayerPlay />
                            </div>
                            <span
                                className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-full text-(--primary) font-bold shadow-lg transform group-hover:-translate-y-1 transition-all">Воспроизвести видео</span>
                        </div>
                    </div>
                    <div
                        className="absolute -top-4 -right-4 w-12 h-12 bg-(--primary-container) rounded-full blur-sm opacity-50 -z-10">
                    </div>
                    <div
                        className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full blur-sm opacity-50 -z-10 bg-(--primary-container)">
                    </div>
                </div>
                <p className="text-sm text-(--on-surface-variant) italic max-w-md mx-auto">
                    Это 2-минутное видео проведёт вас через ввод кода сессии, интерфейс экзамена и процесс отправки финальных ответов.
                </p>
            </div>
        </section >
    )
}

export default HowItWorks
