import { create } from 'zustand';
import { showToast } from '../utils/toast';

const useAuthStore = create((set, get) => ({
    user: null,
    loading: true,
    setUser: (user) => set({ user }),
    logout: async (navigate) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/logout`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                set({ user: null });
                showToast('Logged out successfully', 'success');
                navigate('/');
            } else {
                console.error(data);
                showToast(data.message, 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('An error occurred', 'error');
        }
    },
    login: async (credentials, navigate, redirectPath) => {
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
                navigate(redirectPath);
            } else {
                console.error(data);
                showToast(data.message, 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('An error occurred', 'error');
        } finally {
            set({ loading: false });
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
            console.log(data);
            if (response.ok) {
                set({ user: data.user });
            } else {
                console.error(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            set({ loading: false });
        }
    },
    uploadProfilePicture: async (formData) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/update/profilePicture`, {
                method: 'PUT',
                body: formData,
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                showToast('Profile picture uploaded successfully', 'success');
                get().getUserDetails();
            } else {
                console.error(data);
                showToast(data.message, 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('An error occurred', 'error');
        }
    }
}))

export default useAuthStore;