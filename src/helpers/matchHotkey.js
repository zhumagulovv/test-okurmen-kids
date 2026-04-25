/**
 * Plain utility — checks if a keyboard event matches a hotkey combo.
 * NOT a React hook — safe to call inside useEffect and array .some()
 */
export const matchHotkey = (e, combo) => {
    return (
        e.key.toLowerCase() === combo.key.toLowerCase() &&
        (!!combo.ctrl === e.ctrlKey) &&
        (!!combo.shift === e.shiftKey) &&
        (!!combo.alt === e.altKey)
    )
}