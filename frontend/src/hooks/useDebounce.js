import { useState, useEffect } from "react"

export function useDebounce ({value, delay = 500}) {
    const [debouncedValue, setDebuncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebuncedValue(value)
        }, delay);

        return () => clearTimeout(timer);
    }, [delay, value]);

    return debouncedValue;
}