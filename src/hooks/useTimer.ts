import { useCallback, useEffect, useRef, useState } from "react";

function useTimer(max: number, curr?: number) {
    const [duration, setDuration] = useState(max);
    const [current, setCurrent] = useState(curr || max);

    const interval = useRef<ReturnType<typeof setInterval>>();

    const start = useCallback(function() {
        setCurrent((curr?: number) => (curr as number) - 1);

        interval.current = setInterval(function() {
            setCurrent((curr?: number) => (curr as number) - 1);
        }, 1000);
    }, []);

    function reset(max: number, curr: number) {
        console.log(max, curr);
        setDuration(max);
        setCurrent(curr);

        clearInterval(interval.current);
        start();
    }

    useEffect(function() {
        start();
        return () => clearInterval(interval.current);
    }, [start, interval]);

    return { current, duration, reset };
}

export default useTimer;
