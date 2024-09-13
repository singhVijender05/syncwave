import { useState, useRef, useEffect } from 'react';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    // Scroll to the bottom when new messages are added
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (inputValue.trim() !== '') {
            setMessages([...messages, { sender: 'You', text: inputValue }]);
            setInputValue(''); // Clear input field after sending
        }
    };

    return (
        <div className="chat-container flex flex-col h-full relative w-full border border-gray-300 rounded-lg">
            {/* Messages area */}
            <div className="messages flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                    <p className="text-gray-500 text-center">No messages yet</p>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender === 'You' ? 'text-right' : 'text-left'}`}>
                            <div className="inline-block bg-blue-500 text-white p-2 rounded-md max-w-xs truncate">
                                <strong>{msg.sender}: </strong>
                                <span>{msg.text}</span>
                            </div>
                        </div>
                    ))
                )}
                {/* Invisible div to ensure scroll to bottom */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="input-area flex items-center p-2 border-t border-gray-300">
                <input
                    type="text"
                    className="border border-gray-300 rounded-lg p-2 w-full"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') handleSendMessage();
                    }}
                />
                <button
                    className="bg-blue-500 text-white rounded-lg px-4 py-2 ml-2"
                    onClick={handleSendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
