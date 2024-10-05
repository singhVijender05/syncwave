import { create } from 'zustand';
import { io } from 'socket.io-client';
import useRoomStore from './Room';
import { showToast } from '../utils/toast';

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
            set({ videoUrl: data.videoUrl });
            useRoomStore.getState().setRoom(data.room);
        });

        socket.on('new-member', (data) => {
            // console.log('New member:', data);
            set({ connectedMembers: data.connectedUsers });
            showToast(`${data.memberName} joined the room`, 'info');
            useRoomStore.getState().getMembers(useRoomStore.getState().room._id);
        });

        socket.on('room_members_update', (data) => {
            // console.log('Room members updated:', data);
            set({ connectedMembers: data });
        });

        socket.on('message', (messageData) => {
            set((state) => ({
                messages: [...state.messages, messageData],
            }));
        });

        socket.on('room-name-changed', (data) => {
            //update room name of existing room
            useRoomStore.getState().setRoom(data.room);
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

    joinRoom: (roomId, userId) => {
        const { socket } = get();
        if (socket) {
            socket.emit('join-room', { roomId, userId });
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