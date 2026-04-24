import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    MessageSquare, 
    X, 
    Send, 
    Sparkles, 
    Bot, 
    User, 
    Plus,
    Loader2
} from "lucide-react";
import { chatWithAI, parseExpense, isAIEnabled, isDemoMode } from "../utils/geminiService";
import { useToast } from "../contexts/ToastContext";

const AIAssistant = ({ expenses = [], addExpense, currency = "$" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { 
            id: 1, 
            role: "assistant", 
            content: isDemoMode 
                ? "Hye buddy! I'm running in DEMO MODE. I can still help you parse expenses like 'Spent $20 on food', but connect a Gemini API Key for full intelligence!"
                : "Hye buddy! I'm your Cyber-AI advisor. Need help analyzing your spending or adding an expense? Just ask!",
            timestamp: new Date()
        }
    ]);
    const [activeInput, setActiveInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);
    const toast = useToast();

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!activeInput.trim() || isLoading) return;

        const userMsg = activeInput.trim();
        setActiveInput("");
        
        // Add user message
        const newUserMessage = {
            id: Date.now(),
            role: "user",
            content: userMsg,
            timestamp: new Date()
        };
        
        setMessages(prev => [...prev, newUserMessage]);
        setIsLoading(true);

        try {
            // Check if it's a "spent..." command
            if (userMsg.toLowerCase().startsWith("spent") || userMsg.toLowerCase().includes("$") || userMsg.toLowerCase().includes("price")) {
                const parsed = await parseExpense(userMsg);
                if (parsed && parsed.amount) {
                    const aiResponse = {
                        id: Date.now() + 1,
                        role: "assistant",
                        content: `I've detected a transaction: **${parsed.name}** for **${currency}${parsed.amount}** in **${parsed.category}**. Would you like me to add it?`,
                        timestamp: new Date(),
                        data: parsed
                    };
                    setMessages(prev => [...prev, aiResponse]);
                    setIsLoading(false);
                    return;
                }
            }

            // Normal chat
            const response = await chatWithAI(userMsg, expenses, currency);
            const aiMessage = {
                id: Date.now() + 1,
                role: "assistant",
                content: response,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            toast.error("AI connection failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const confirmExpense = (data) => {
        addExpense({
            name: data.name,
            amount: data.amount,
            category: data.category || "Other",
            date: data.date || new Date().toISOString().slice(0, 10),
            createdAt: Date.now()
        });
        
        setMessages(prev => [...prev, {
            id: Date.now() + 2,
            role: "assistant",
            content: "Done! I've added that transaction to your ledger. 🚀",
            timestamp: new Date()
        }]);
        
        toast.success("AI added expense!");
    };

    if (!isAIEnabled) return null;

    return (
        <div className="ai-assistant-wrapper">
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="ai-chat-window glass-effect"
                    >
                        {/* Chat Header */}
                        <div className="ai-chat-header">
                            <div className="ai-header-info">
                                <div className="ai-avatar-glow">
                                    <Bot size={20} color="white" />
                                </div>
                                <div>
                                    <h4 className="ai-chat-title">EXO-VAULT</h4>
                                    <span className="ai-online-status" style={{ color: isDemoMode ? "var(--warning)" : "var(--success)" }}>
                                        {isDemoMode ? "Demo Mode (Offline)" : "Neural Uplink Active"}
                                    </span>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="ai-close-btn">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Chat Messages */}
                        <div className="ai-chat-body">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`ai-message-row ${msg.role}`}>
                                    <div className="ai-message-bubble">
                                        <div className="ai-message-content">
                                            {msg.content.split('\n').map((line, i) => (
                                                <p key={i}>{line}</p>
                                            ))}
                                        </div>
                                        {msg.data && (
                                            <button 
                                                onClick={() => confirmExpense(msg.data)}
                                                className="ai-add-btn"
                                            >
                                                <Plus size={14} /> Add Transaction
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="ai-message-row assistant">
                                    <div className="ai-message-bubble loading">
                                        <Loader2 className="animate-spin" size={16} />
                                        <span>Synthesizing response...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Chat Input */}
                        <form onSubmit={handleSend} className="ai-chat-input-area">
                            <input 
                                value={activeInput}
                                onChange={(e) => setActiveInput(e.target.value)}
                                placeholder="Ask AI advisor anything..."
                                className="ai-input-field"
                            />
                            <button type="submit" disabled={isLoading} className="ai-send-btn">
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="ai-toggle-bubble"
                style={{
                    background: isOpen ? "var(--danger)" : "var(--primary)",
                    boxShadow: `0 8px 32px ${isOpen ? 'rgba(239, 68, 68, 0.4)' : 'var(--primary-glow)'}`
                }}
            >
                {isOpen ? <X size={24} color="white" /> : <Sparkles size={24} color="white" />}
            </motion.button>
        </div>
    );
};

export default AIAssistant;
