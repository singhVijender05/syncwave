import { useRef, useEffect } from 'react';
import useSocketStore from '../../store/Socket';
import useRoomStore from '../../store/Room';
import PropTypes from 'prop-types'; // Import prop-types
import useAuthStore from '../../store/Auth';
import { BsPersonCircle } from 'react-icons/bs';

const Chat = ({ roomId }) => {
    const { messages } = useSocketStore();
    const { sendMessage } = useRoomStore();
    const { user } = useAuthStore();
    const messagesEndRef = useRef(null);

    // Scroll to the bottom when new messages are added
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        const messageInput = document.getElementById('message-input');
        if (messageInput.value.trim() === '') return;
        sendMessage(roomId, messageInput.value);
        document.getElementById('message-input').value = '';
    };

    return (
        <div className="chat-container bg-[url('/chats/dark_bg.png')] flex flex-col h-full relative w-full border border-gray-500 rounded-lg">
            <div className="messages flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                    <p className="text-gray-500 text-center">No messages yet</p>
                ) : (
                    messages.map((message, index) => (
                        <div key={index} className={`chat ${user._id == message.userId ? 'chat-end' : 'chat-start'}`}>
                            <div className="chat-image avatar">
                                <div className="w-10 rounded-full">
                                    {
                                        message.profilePicture ?
                                            <img
                                                alt="profile"
                                                src={message.profilePicture} /> :
                                            <BsPersonCircle size={40} />
                                    }
                                </div>
                            </div>
                            <div className="chat-header">
                            </div>
                            <div className="chat-bubble flex flex-col min-w-[50%]">
                                <div className='text-xs font-light'>
                                    {message.userId == user._id ? 'You' : message.sender}
                                </div>
                                <div className='text-sm'>
                                    {message.content}
                                </div>
                                <time className="text-xs opacity-50 text-right">{message.time}</time>
                            </div>
                        </div>
                    ))
                )}
                {/* Invisible div to ensure scroll to bottom */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="input-area flex items-center p-2 border-t border-gray-500 backdrop-blur-2xl rounded-b-xl">
                <input
                    id='message-input'
                    type="text"
                    className="border border-gray-300 rounded-lg p-2 w-full min-h-12 outline-none"
                    placeholder="Type a message..."
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') handleSendMessage();
                    }}
                />
                <button
                    className="btn btn-neutral text-white rounded-lg ml-2"
                    onClick={handleSendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

Chat.propTypes = {
    roomId: PropTypes.string.isRequired
};

export default Chat;



<div className="chat chat-end">
    <div className="chat-image avatar">
        <div className="w-10 rounded-full">
            <img
                alt="Tailwind CSS chat bubble component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
    </div>
    <div className="chat-header">
        Anakin
        <time className="text-xs opacity-50">12:46</time>
    </div>
    <div className="chat-bubble">I hate you!</div>
    <div className="chat-footer opacity-50">Seen at 12:46</div>
</div>
