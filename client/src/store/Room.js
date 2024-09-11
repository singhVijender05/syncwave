import { create } from "zustand";
import { showToast } from "../utils/toast";

const useRoomStore = create((set) => ({
    room: null,
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
    }
}))

export default useRoomStore