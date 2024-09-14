import { create } from 'zustand';
import { io } from 'socket.io-client';
import useRoomStore from './Room';

const useSocketStore = create((set) => ({
    socket: null,
    videoUrl: null, // Add state for storing video URL
    members: [],    // Add state for tracking room members
    messages: [],   // Add state for chat messages

    // Function to set the socket connection
    setSocket: (socket) => set({ socket }),
    setVideoUrl: (videoUrl) => set({ videoUrl }),

    // Function to create a new socket connection
    createSocket: () => {
        const socket = io(`${import.meta.env.VITE_WS_URL}`, {
            autoConnect: true,
        });
        set({ socket });

        // Connection event
        socket.on('connect', () => {
            console.log('connected to server');
        });

        // Listening for the video URL broadcast to the room
        socket.on('video-url', (data) => {
            console.log('Video URL received:', data.videoUrl);
            set({ videoUrl: data.videoUrl });
        });

        // Listening for new members joining the room
        socket.on('new-member', (data) => {
            set((state) => ({
                members: [...state.members, data.memberName],
            }));
            useRoomStore.getState().getMembers(useRoomStore.getState().room._id);
        });

        // Listening for chat messages in the room
        socket.on('chat-message', (messageData) => {
            set((state) => ({
                messages: [...state.messages, messageData],
            }));
        });

        // Handling the room closure
        socket.on('room-closed', () => {
            console.log('The room was closed');
            socket.disconnect();
        });
    },

    // Function to emit a chat message to the room
    sendMessage: (roomId, message) => {
        const { socket } = useSocketStore.getState();
        if (socket) {
            socket.emit('chat-message', { roomId, message });
        }
    },

    // Function to join a specific room
    joinRoom: (roomId) => {
        const { socket } = useSocketStore.getState();
        if (socket) {
            socket.emit('join-room', { roomId });
        }
    },

    // Function to leave the room
    leaveRoom: (roomId) => {
        const { socket } = useSocketStore.getState();
        if (socket) {
            socket.emit('leave-room', { roomId });
        }
    },
}));

export default useSocketStore;
