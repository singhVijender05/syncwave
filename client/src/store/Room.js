import { create } from "zustand";
import { showToast } from "../utils/toast";
import useSocketStore from "./Socket";

const useRoomStore = create((set, get) => ({
    room: null,
    members: [],
    setRoom: (room) => set({ room }),
    createRoom: async (roomName, navigate) => {
        try {
            showToast('Creating room...', 'loading');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/room/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: roomName }),
                credentials: 'include'
            });
            const data = await response.json();
            showToast('', 'dismiss');
            if (response.ok) {
                set({ room: data.room });
                showToast('Room created successfully', 'success');
                navigate(`/rooms/${data.room._id}`);
            } else {
                console.error(data);
                showToast(data.message, 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('An error occurred', 'error');
        }
    },
    getRoomDetails: async (roomId) => {
        try {
            showToast('Fetching room details...', 'loading');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/room/${roomId}`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();
            showToast('', 'dismiss');
            if (response.ok) {
                set({ room: data.room });
                useSocketStore.getState().setVideoUrl(data.room.videoUrl);
            } else {
                console.error(data);
                showToast(data.message, 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('An error occurred', 'error');
        }
    },
    sendVideoUrl: async (roomId, videoUrl) => {
        try {
            showToast('Setting video URL...', 'loading');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/room/video/${roomId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ videoUrl }),
                credentials: 'include'
            });
            const data = await response.json();
            showToast('', 'dismiss');
            if (response.ok) {
                showToast(data.message, 'success');
            } else {
                console.error(data);
                showToast(data.message, 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('An error occurred', 'error');
        }
    },
    joinRoom: async (roomId) => {
        try {
            showToast('Joining room...', 'loading');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/room/join/${roomId}`, {
                method: 'POST',
                credentials: 'include'
            });
            const data = await response.json();
            console.log(data);
            showToast('', 'dismiss');
            if (response.ok) {
                useSocketStore.getState().joinRoom(roomId);
                showToast('Room joined successfully', 'success');
                get().getRoomDetails(roomId);
                get().getMembers(roomId);
            } else {
                console.error(data);
                showToast(data.message, 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('An error occurred', 'error');
        }
    },
    getMembers: async (roomId) => {
        try {
            showToast('Fetching members...', 'loading');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/room/members/${roomId}`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();
            console.log(data);
            showToast('', 'dismiss');
            if (response.ok) {
                set({ members: data.members });
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

export default useRoomStore