const TextAnswer = ({value = "", onChange}) => {
    return (
        <div className="bg-(--surface-container-lowest) rounded-3xl p-1 bg-linear-to-br from-(--surface-container-low) to-(--surface-container)">
            <div className="bg-(--surface-container-lowest) rounded-[1.25rem] p-6 md:p-8">
                <textarea
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    className="w-full min-h-100 bg-(--surface-container-high)/30 border-none rounded-2xl p-6 text-(--on-surface) placeholder:text-(--on-surface-variant)/40 focus:ring-2 focus:ring-[#0057bd]/40 focus:bg-(--surface-container-lowest) transition-all font-body text-lg leading-relaxed resize-none"
                    placeholder="Начните писать ваше объяснение здесь..."
                />
            </div>
        </div>
    );
};

export default TextAnswer;