import { create } from "zustand";
import { showToast } from "../utils/toast";
import useSocketStore from "./Socket";

const useRoomStore = create((set, get) => ({
    room: null,
    rooms: [],
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
                showToast(data.error, 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('An error occurred', 'error');
        }
    },
    getRoomDetails: async (roomId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/room/${roomId}`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();
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
                showToast(data.error, 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('An error occurred', 'error');
        }
    },
    joinRoom: async (roomId, userId) => {
        try {
            showToast('Joining room...', 'loading');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/room/join/${roomId}`, {
                method: 'POST',
                credentials: 'include'
            });
            const data = await response.json();
            showToast('', 'dismiss');
            if (response.ok) {
                useSocketStore.getState().joinRoom(roomId, userId);
                showToast('Room joined successfully', 'success');
                get().getRoomDetails(roomId);
                get().getMembers(roomId);
                get().getAllMessages(roomId);
            } else {
                console.error(data);
                showToast(data.error, 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('An error occurred', 'error');
        }
    },
    getMembers: async (roomId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/room/members/${roomId}`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();
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
    },
    sendMessage: async (roomId, message) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/room/sendmessage/${roomId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message }),
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                //
            } else {
                console.error(data);
                showToast(data.message, 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('An error occurred', 'error');
        }
    },
    getAllMessages: async (roomId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/room/getmessages/${roomId}`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                useSocketStore.getState().setMessages(data.messages);
            } else {
                console.error(data);
                showToast(data.message, 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('An error occurred', 'error');
        }
    },
    getAllRooms: async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/room/getRooms`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                set({ rooms: data });
            } else {
                console.error(data);
                showToast(data.message, 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('Please login first', 'error');
        }
    },
    deleteRoomById: async (roomId) => {
        try {
            showToast('Deleting room...', 'loading');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/room/delete/${roomId}`, {
                method: 'POST',
                credentials: 'include'
            });
            const data = await response.json();
            showToast('', 'dismiss');
            if (response.ok) {
                get().getAllRooms();
                showToast('Room deleted successfully', 'success');
            } else {
                console.error(data);
                showToast(data.message, 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('An error occurred', 'error');
        }
    },
    changeRoomName: async (roomId, name) => {
        try {
            showToast('Changing room name...', 'loading');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/room/update/${roomId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newname: name }),
                credentials: 'include'
            });
            const data = await response.json();
            showToast('', 'dismiss');
            if (response.ok) {
                showToast('Room name changed successfully', 'success');
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