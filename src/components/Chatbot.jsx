import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hello! I\'m your NeuroAssist AI companion. I can help you with information about neurological disorders, guide you to our services, and answer your questions. How can I assist you today?'
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = inputMessage;
        setInputMessage('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
            
            const prompt = `
You are a helpful AI assistant for NeuroAssist, a website that provides services for neurological disorders.
You can help users with information about:
- Autism detection and assessment
- OCD (Obsessive-Compulsive Disorder) detection and assessment
- Dyslexia detection and assessment
- General information about neurological disorders

The user's message is: "${userMessage}"

IMPORTANT: Provide a CONCISE response (2-3 short paragraphs maximum). Be brief but helpful.

Your response should:
1. Directly address the user's question or concern
2. If relevant, suggest which of our services might be helpful
3. Provide accurate, empathetic information about neurological disorders
4. Maintain a supportive and understanding tone

Keep your response short and to the point. Avoid lengthy explanations.
`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            setMessages(prev => [...prev, { role: 'assistant', content: text }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: 'I apologize, but I encountered an error. Please try again.' 
            }]);
        }

        setIsLoading(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
                >
                    <ChatBubbleOutlineIcon />
                </button>
            ) : (
                <div className="bg-white rounded-lg shadow-xl w-96 h-[600px] flex flex-col">
                    <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                        <h3 className="font-semibold">NeuroAssist AI</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-blue-700 rounded-full p-1"
                        >
                            <CloseIcon />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${
                                    message.role === 'user' ? 'justify-end' : 'justify-start'
                                }`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-3 ${
                                        message.role === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 rounded-lg p-3">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="border-t p-4">
                        <div className="flex space-x-2">
                            <textarea
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                className="flex-1 border rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="1"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={isLoading || !inputMessage.trim()}
                                className="bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <SendIcon />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot; 