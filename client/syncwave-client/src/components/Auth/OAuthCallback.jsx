import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const OAuthCallback = () => {
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const accessToken = query.get('accessToken');
    const refreshToken = query.get('refreshToken');
    
    if (accessToken && refreshToken) {
      // Store tokens in cookies
      Cookies.set('accessToken', accessToken, { secure: true, sameSite: 'strict' });
      Cookies.set('refreshToken', refreshToken, { secure: true, sameSite: 'strict' });

      // Redirect to the desired page
      window.location.href = '/dashboard';
    }
  }, [location]);

  return <div>Loading...</div>;
};

export default OAuthCallback;
