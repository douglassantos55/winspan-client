import { PropsWithChildren } from "react";

function App(props: PropsWithChildren) {
    return (
        <>
            <header>Header</header>
            {props.children}
        </>
    );
}

export default App;
