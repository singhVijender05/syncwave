import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const useRequireAuth = (user, loading) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // If the user is not logged in, redirect to the login page
        if (!loading && !user) {
            navigate(`/sign-in?redirect=${encodeURIComponent(location.pathname)}`);
        }
    }, [user, loading, navigate, location]);

    return user; // Return user to be used in the component
};

export default useRequireAuth;
