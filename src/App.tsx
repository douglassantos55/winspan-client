import { PropsWithChildren } from "react";

function App(props: PropsWithChildren) {
    return (
        <>
            {props.children}
        </>
    );
}

export default App;
