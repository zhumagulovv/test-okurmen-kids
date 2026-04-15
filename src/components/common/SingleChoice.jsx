const SingleChoice = ({ options = [], name = 'question', value, onChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            {options.map(({ id, text }, i) => {
                const letter = String.fromCharCode(65 + i);
                const isChecked = value === id;

                return (
                    <label key={id} className="group relative cursor-pointer block">
                        <input
                            type="radio"
                            name={name}
                            value={id}
                            checked={isChecked}
                            onChange={() => onChange(id)}
                            className="absolute opacity-0 w-0 h-0"
                        />
                        <div className={`h-full p-6 rounded-(--xl) bg-(--surface-container-lowest) border-2 transition-all duration-200 
                            ${isChecked
                                ? 'border-(--primary) bg-(--primary)/5'
                                : 'border-transparent hover:bg-(--surface-container-high)'
                            } group-active:scale-[0.98]`}>
                            <div className="flex items-center justify-between mb-4">
                                <span className="w-10 h-10 rounded-(--lg) bg-(--surface-container-high) flex items-center justify-center text-(--on-surface) font-bold font-headline">
                                    {letter}
                                </span>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                                    ${isChecked
                                        ? 'border-(--primary) bg-(--primary)'
                                        : 'border-(--outline-variant)'
                                    }`}>
                                    {isChecked && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                                </div>
                            </div>
                            <p className="font-body text-lg text-(--on-surface) font-semibold">{text}</p>
                        </div>
                    </label>
                );
            })}
        </div>
    );
};

export default SingleChoice;