import { create } from 'zustand';
import { io } from 'socket.io-client';
import useRoomStore from './Room';

const useSocketStore = create((set, get) => ({
    socket: null,
    videoUrl: null,
    connectedMembers: [],
    messages: [],

    setSocket: (socket) => set({ socket }),
    setVideoUrl: (videoUrl) => set({ videoUrl }),
    setMessages: (messages) => set({ messages }),

    createSocket: () => {
        const socket = io(`${import.meta.env.VITE_WS_URL}`, {
            autoConnect: true,
        });
        set({ socket });

        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('video-url', (data) => {
            console.log('Video URL received:', data.videoUrl);
            set({ videoUrl: data.videoUrl });
        });

        socket.on('new-member', (data) => {
            set((state) => ({
                connectedMembers: [...state.connectedMembers, data.memberName],
            }));
            useRoomStore.getState().getMembers(useRoomStore.getState().room._id);
        });

        socket.on('message', (messageData) => {
            set((state) => ({
                messages: [...state.messages, messageData],
            }));
        });

        socket.on('room-closed', () => {
            console.log('The room was closed');
            socket.disconnect();
        });
    },

    sendMessage: (roomId, message) => {
        const { socket } = get();
        if (socket) {
            socket.emit('chat-message', { roomId, message });
        }
    },

    joinRoom: (roomId) => {
        const { socket } = get();
        if (socket) {
            socket.emit('join-room', { roomId });
        }
    },

    leaveRoom: (roomId) => {
        const { socket } = get();
        if (socket) {
            socket.emit('leave-room', { roomId });
        }
    },
}));

export default useSocketStore