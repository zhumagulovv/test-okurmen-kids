import { useEffect, useMemo, useState } from "react"
import useOutsideClick from "../../hooks/useOutsideClick"
import { RiArrowDropDownLine } from "react-icons/ri"

const Dropdown = ({ options = [], value, onChange, placeholder, variant }) => {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')

    const dropdownRef = useOutsideClick(() => setOpen(false))

    // синхронизация выбранного значения
    useEffect(() => {
        if (!open) {
            const selected = options.find(o => o.value === value)
            setSearch(selected?.label || '')
        }
    }, [value, open, options])

    // фильтрация
    const filteredOptions = useMemo(() => {
        if (open && search === '') return options

        return options.filter(item =>
            item.label.toLowerCase().includes(search.toLowerCase())
        )
    }, [options, search, open])

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div className={`
                w-full flex items-center gap-2 rounded-xl px-4 py-3 cursor-pointer
                ${variant === 'hero'
                    ? 'bg-white/15 text-white border border-white/20'
                    : 'bg-(--surface-container-lowest)'
                }
            `}>
                <input
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value)
                        setOpen(true)
                    }}
                    onFocus={() => {
                        setOpen(true)
                        setSearch('')
                    }}
                    placeholder={placeholder}
                    className="w-full bg-transparent outline-none text-sm"
                />

                <RiArrowDropDownLine
                    onClick={() => {
                        setOpen(prev => {
                            if (!prev) setSearch('')
                            return !prev
                        })
                    }}
                    className="text-2xl cursor-pointer"
                />
            </div>

            {open && (
                <div className="absolute top-full mt-2 w-full bg-(--surface-container-lowest) rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                    {filteredOptions.length ? (
                        filteredOptions.map((item) => (
                            <div
                                key={item.value}
                                onClick={() => {
                                    onChange(item.value)
                                    setSearch(item.label)
                                    setOpen(false)
                                }}
                                className="px-4 py-3 hover:bg-(--surface-container-high) cursor-pointer"
                            >
                                {item.label}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-sm opacity-50">
                            Ничего не найдено
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Dropdown