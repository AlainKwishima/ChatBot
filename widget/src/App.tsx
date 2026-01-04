import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Loader2, Sparkles } from 'lucide-react'
import { api } from './api'

interface Message {
    role: 'user' | 'bot';
    content: string;
}

function App() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', content: 'Hello! Welcome to Empirical Tours. How can I help you explore East Africa today? 🌍' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const toggleChat = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage = inputValue.trim();
        setInputValue('');

        // Add user message with animation
        const newMessages: Message[] = [
            ...messages,
            { role: 'user', content: userMessage }
        ];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const response = await api.sendMessage(userMessage, messages.map(m => ({
                role: m.role === 'bot' ? 'assistant' : 'user',
                content: m.content
            })));

            setMessages(prev => [...prev, { role: 'bot', content: response.answer }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'bot', content: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-widget-container">
            <div className={`chat-window ${!isOpen ? 'hidden' : ''}`}>
                <div className="chat-header">
                    <div className="header-content">
                        <img
                            src="/assets/logo.png"
                            alt="Empirical Tours"
                            className="header-logo"
                        />
                        <div className="header-text">
                            <h3>Empirical Tours</h3>
                            <span className="header-status">
                                <span className="status-dot"></span>
                                Demo Mode
                            </span>
                        </div>
                    </div>
                    <button className="close-btn" onClick={toggleChat} aria-label="Close chat">
                        <X size={20} />
                    </button>
                </div>

                <div className="chat-messages">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`message ${msg.role} message-fade-in`}>
                            {msg.role === 'bot' && (
                                <div className="bot-avatar">
                                    <Sparkles size={14} />
                                </div>
                            )}
                            <div className="message-content">
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message bot message-fade-in">
                            <div className="bot-avatar">
                                <Sparkles size={14} />
                            </div>
                            <div className="message-content">
                                <div className="loading-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form className="chat-input-area" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="chat-input"
                        placeholder="Ask about tours, destinations..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={isLoading}
                    />
                    <button type="submit" className="send-btn" disabled={isLoading || !inputValue.trim()}>
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    </button>
                </form>

                <div className="chat-footer">
                    <span>Powered by Empirical AI</span>
                </div>
            </div>

            <button className="chat-launcher" onClick={toggleChat} aria-label="Toggle chat">
                {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
                {!isOpen && <span className="launcher-badge">1</span>}
            </button>
        </div>
    )
}

export default App
