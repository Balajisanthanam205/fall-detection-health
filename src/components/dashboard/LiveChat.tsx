import { useState, useEffect, useRef } from 'react';
import { Send, Mic, Paperclip, X } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'patient' | 'responder';
  timestamp: Date;
}

interface LiveChatProps {
  patientName: string;
  onClose?: () => void;
}

const LiveChat: React.FC<LiveChatProps> = ({ patientName, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello, is everything okay? We detected an emergency.`,
      sender: 'responder',
      timestamp: new Date(Date.now() - 60000),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Mock responses from the patient
  const patientResponses = [
    "I fell down, but I think I'm okay.",
    "My chest hurts a bit.",
    "I'm feeling dizzy.",
    "I need help, please.",
    "I'm having trouble breathing.",
  ];
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Simulate patient response after responder sends a message
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === 'responder') {
      const timeout = setTimeout(() => {
        const randomResponse = patientResponses[Math.floor(Math.random() * patientResponses.length)];
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            text: randomResponse,
            sender: 'patient',
            timestamp: new Date(),
          },
        ]);
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [messages]);
  
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: newMessage,
          sender: 'responder',
          timestamp: new Date(),
        },
      ]);
      setNewMessage('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-primary-500 text-white">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
          <h3 className="font-semibold">Live Chat with {patientName}</h3>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'responder' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'responder'
                  ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100'
                  : 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-white'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-gray-200 dark:border-slate-700 p-4">
        <div className="flex items-center">
          <button
            type="button"
            className="p-2 rounded-full text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 mx-2 py-2 px-3 rounded-md border-0 focus:ring-2 focus:ring-primary-500 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
            rows={1}
          />
          
          <button
            type="button"
            className="mr-2 p-2 rounded-full text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <Mic className="h-5 w-5" />
          </button>
          
          <button
            type="button"
            onClick={handleSendMessage}
            className="p-2 rounded-full bg-primary-500 text-white hover:bg-primary-600"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;