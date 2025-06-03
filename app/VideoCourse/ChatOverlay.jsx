'use client';
import { useState, useEffect } from 'react';
import { Send } from '@mui/icons-material';

const ChatOverlay = ({ streamId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const savedChat = JSON.parse(localStorage.getItem(`chat-${streamId}`) || '[]');
    setMessages(savedChat);
  }, [streamId]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      text: newMessage,
      timestamp: new Date().toISOString(),
      user: 'مستخدم'
    };

    const updated = [...messages, newMsg];
    localStorage.setItem(`chat-${streamId}`, JSON.stringify(updated));
    setMessages(updated);
    setNewMessage('');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg h-[500px] flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold">دردشة البث المباشر</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between text-sm text-gray-500">
              <span>{msg.user}</span>
              <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
            <p className="mt-1">{msg.text}</p>
          </div>
        ))}
      </div>

      <div className="p-4 border-t flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="اكتب رسالتك..."
          className="flex-1 p-2 border rounded"
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Send fontSize="small" />
        </button>
      </div>
    </div>
  );
};
export default ChatOverlay;