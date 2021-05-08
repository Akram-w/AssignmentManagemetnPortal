import { Redirect } from 'react-router-dom'
const withAuth = (Component) => {
    const AuthRoute = () => {
        const isAuth = !!sessionStorage.getItem("token");
        if (isAuth) {
            return <Component />;
        } else {
            return <Redirect to="/" />;
        }
    };
    return AuthRoute

}
export default withAuth