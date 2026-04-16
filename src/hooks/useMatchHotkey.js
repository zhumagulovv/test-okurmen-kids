export const useMatchHotkey = (e, combo) => {
    return (
        e.key.toLowerCase() === combo.key.toLowerCase() &&
        (!!combo.ctrl === e.ctrlKey) &&
        (!!combo.shift === e.shiftKey) &&
        (!!combo.alt === e.altKey)
    );
};