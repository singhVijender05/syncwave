import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useRequireAuth = (user, loading) => {
    const navigate = useNavigate(); // Get the navigate function from the useNavigate hook

    useEffect(() => {
        // If the user is not logged in, redirect to the login page
        if (!loading && !user) {
            navigate('/sign-in');
        }
    }, [user, loading, navigate]);

    return user; // Return user to be used in the component
};

export default useRequireAuth;
