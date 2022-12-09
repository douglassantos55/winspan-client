import { ReactElement } from "react";
import { Params, useParams } from "react-router-dom";

type Props = {
    children: (params: Readonly<Params<string>>) => ReactElement;
}

function ParamProvider({ children }: Props) {
    const params = useParams();
    return children(params);
}

export default ParamProvider;
