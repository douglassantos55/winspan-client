import { useParams } from "react-router-dom";

function withRouteParams(Component: any) {
    const params = useParams();
    return <Component {...params} />;

}

export default withRouteParams;
