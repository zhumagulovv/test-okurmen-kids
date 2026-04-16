import { useEffect, useRef } from "react";

function useOutsideClick(callback) {
    const ref = useRef();

    useEffect(() => {
        const handleClick = (event) => {
            // If the clicked element is not inside the ref, trigger the callback
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        };

        document.addEventListener("mousedown", handleClick);
        // Cleanup listener on unmount
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, [callback]);

    return ref;
}

export default useOutsideClick;