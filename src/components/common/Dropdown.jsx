import { useState } from 'react'
import { RiArrowDropDownLine } from 'react-icons/ri'
import useOutsideClick from '../../hooks/useOutsideClick'

const Dropdown = ({ options, value, onChange, placeholder }) => {
    const [open, setOpen] = useState(false)
    const dropdownRef = useOutsideClick(() => setOpen(false))

    return (
        <div className="relative w-full lg:w-48" ref={dropdownRef}>
            {/* Trigger */}
            <button
                onClick={() => setOpen(prev => !prev)}
                className="w-full flex items-center justify-between bg-(--surface-container-lowest) rounded-xl py-3 px-4 text-(--on-surface) font-semibold focus:ring-2 focus:ring-(--primary)/40"
            >
                <span>{value || placeholder}</span>
                <RiArrowDropDownLine className="text-3xl" />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute top-full mt-2 w-full bg-(--surface-container-lowest) rounded-xl shadow-lg z-50 overflow-hidden border border-(--outline-variant)/10">
                    {options.map((item, i) => (
                        <div
                            key={i}
                            onClick={() => {
                                onChange(item)
                                setOpen(false)
                            }}
                            className="px-4 py-3 cursor-pointer hover:bg-(--surface-container-high) transition"
                        >
                            {item}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Dropdown