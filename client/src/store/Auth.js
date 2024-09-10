import { create } from 'zustand';
import { showToast } from '../utils/toast';

const useAuthStore = create((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),
    login: async (credentials, navigate) => {
        if (!credentials.email || !credentials.password) {
            return showToast('Please fill in all fields', 'error');
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials),
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                set({ user: data.user });
                showToast('Logged in successfully', 'success');
                navigate('/dashboard');
            } else {
                console.error(data);
                showToast(data.message, 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('An error occurred', 'error');
        }
    },
    signup: async (credentials, navigate) => {
        if (!credentials.email || !credentials.password || !credentials.name) {
            return showToast('Please fill in all fields', 'error');
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials),
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                showToast('Account created successfully', 'success');
                navigate('/sign-in');
            } else {
                console.error(data);
                showToast(data.message, 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('An error occurred', 'error');
        }
    },
    getUserDetails: async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/user-details`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                set({ user: data.user });
            } else {
                console.error(data);
            }
        } catch (error) {
            console.error(error);
        }
    }
}))

export default useAuthStore;