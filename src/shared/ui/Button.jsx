import React from "react";

const Button = ({
    children,
    onClick,
    variant = "primary",
    size = "md",
    icon,
    iconPosition = "right",
    loading = false,
    loadingText = "Загрузка...",
    disabled = false,
    type = "button",
    fullWidth = true,
}) => {
    const isDisabled = loading || disabled;

    const Spinner = (
        <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
            />
        </svg>
    );

    const base =
        "rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]";

    const width = fullWidth ? "w-full" : "w-auto px-6";

    const variants = {
        primary:
            "bg-(--primary) text-(--on-primary)",
        gradient:
            "bg-linear-to-r from-(--primary) to-(--primary-dim) text-(--on-primary)",
        secondary:
            "py-5 bg-white text-(--secondary) border-2 hover:border-(--secondary)/5 hover:bg-(--secondary)/5",
    };

    const sizes = {
        sm: "py-2 text-sm",
        md: "py-4 text-base",
        lg: "py-6 text-xl",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={`${base} ${width} ${variants[variant]} ${sizes[size]} ${isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                }`}
        >
            {loading ? (
                <>
                    {Spinner}
                    {loadingText}
                </>
            ) : (
                <>
                    {icon && iconPosition === "left" && icon}
                    {children}
                    {icon && iconPosition === "right" && icon}
                </>
            )}
        </button>
    );
};

export default Button;