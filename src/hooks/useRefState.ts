import { Dispatch, MutableRefObject, useEffect, useRef, useState } from "react";

function useRefState<T>(initial: T): [MutableRefObject<T>, T, Dispatch<any>] {
    const ref = useRef(initial);
    const [state, setState] = useState<T>(initial);

    useEffect(() => { ref.current = state }, [state]);

    return [ref, state, setState];
}

export default useRefState;
