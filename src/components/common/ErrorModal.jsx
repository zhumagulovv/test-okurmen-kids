const ErrorModal = ({ message, onClose, onRetry }) => {
    return (
        <div
            className="fixed inset-0 z-200 flex items-center justify-center bg-black/50 px-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-(--surface-container-lowest) rounded-(--xl) border border-(--outline-variant)/20 p-8 max-w-md w-full shadow-xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-(--error)/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-(--error) text-xl">error</span>
                    </div>
                    <div>
                        <h2 className="font-headline font-bold text-lg text-(--on-surface) mb-1">
                            Ошибка завершения теста
                        </h2>
                        <p className="text-sm text-(--on-surface-variant) leading-relaxed">
                            {message || 'Не удалось отправить ответы. Проверьте соединение и попробуйте снова.'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-(--xl) text-sm font-bold text-(--on-surface-variant) bg-(--surface-container-high) hover:bg-(--surface-container-highest) transition-all active:scale-95"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={onRetry}
                        className="px-5 py-2.5 rounded-(--xl) text-sm font-bold text-white bg-(--error) hover:bg-(--error)/90 transition-all active:scale-95"
                    >
                        Попробовать снова
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ErrorModal