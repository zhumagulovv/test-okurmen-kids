import { LuChevronLeft, LuChevronRight } from "react-icons/lu"

function Pagination({ currentPage, totalPages, onPageChange }) {
    const pages = []

    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
        pages.push(1)
        if (currentPage > 3) pages.push('...')
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(i)
        }
        if (currentPage < totalPages - 2) pages.push('...')
        pages.push(totalPages)
    }

    return (
        <div className="mt-12 flex justify-center items-center gap-2">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-(--surface-container) hover:bg-(--surface-container-high) transition-colors text-(--on-surface) disabled:opacity-40"
            >
                <LuChevronLeft />
            </button>

            {pages.map((p, i) =>
                p === '...'
                    ? <span key={`ellipsis-${i}`} className="px-2">...</span>
                    : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors
                                ${p === currentPage
                                    ? 'bg-(--primary) text-(--on-primary)'
                                    : 'bg-(--surface-container-low) hover:bg-(--surface-container-high)'
                                }`}
                        >
                            {p}
                        </button>
                    )
            )}

            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-(--surface-container) hover:bg-(--surface-container-high) transition-colors text-(--on-surface) disabled:opacity-40"
            >
                <LuChevronRight />
            </button>
        </div>
    )
}

export default Pagination