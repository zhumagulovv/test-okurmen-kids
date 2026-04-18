import { useEffect, useMemo, useState } from "react"
import useOutsideClick from "../../hooks/useOutsideClick"
import { RiArrowDropDownLine } from "react-icons/ri"

const Dropdown = ({ options, value, onChange, placeholder, variant }) => {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState(value || '')
    const dropdownRef = useOutsideClick(() => setOpen(false))

    useEffect(() => {
        setSearch(value || '')
    }, [value])

    const filteredOptions = useMemo(() => {
        return options.filter(item =>
            item.toLowerCase().includes(search.toLowerCase())
        )
    }, [options, search])

    return (
        <div className="relative w-full" ref={dropdownRef}>

            {/* Trigger */}
            <div
                className={`
                    w-full flex items-center gap-2 rounded-xl px-4 py-3
                    ${variant === 'hero'
                        ? 'bg-white/15 text-white border border-white/20 focus-within:ring-2 focus-within:ring-white/40'
                        : 'bg-(--surface-container-lowest) text-(--on-surface) focus-within:ring-2 focus-within:ring-(--primary)/40'
                    }
                `}
            >
                <input
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value)
                        setOpen(true)
                    }}
                    onFocus={() => setOpen(true)}
                    placeholder={placeholder}
                    className={`
                        w-full bg-transparent outline-none text-sm
                        ${variant === 'hero'
                            ? 'placeholder:text-white/50'
                            : 'placeholder:text-(--on-surface-variant)'
                        }
                    `}
                />

                <RiArrowDropDownLine
                    onClick={() => setOpen(prev => !prev)}
                    className="text-2xl cursor-pointer shrink-0"
                />
            </div>

            {/* Dropdown */}
            {open && (
                <div className="absolute top-full mt-2 w-full bg-(--surface-container-lowest) rounded-xl shadow-lg z-50 border border-(--outline-variant)/10 max-h-60 overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((item, i) => (
                            <div
                                key={i}
                                onClick={() => {
                                    onChange(item)
                                    setSearch(item)
                                    setOpen(false)
                                }}
                                className="px-4 py-3 cursor-pointer hover:bg-(--surface-container-high) transition text-sm"
                            >
                                {item}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-sm text-(--on-surface-variant)">
                            Ничего не найдено
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Dropdown