'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';

interface ChatInputProps {
    onSubmit: (message: string) => Promise<void>;
    isLoading?: boolean;
    placeholder?: string;
}

const suggestions = [
    'Add MongoDB as the database',
    'Switch to microservices architecture',
    'Include authentication with OAuth',
    'Add caching layer with Redis',
];

export function ChatInput({ onSubmit, isLoading, placeholder }: ChatInputProps) {
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = async () => {
        if (!message.trim() || isLoading) return;
        await onSubmit(message);
        setMessage('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleInput = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
        }
    };

    return (
        <div className="chat-input-container p-4">
            {/* Suggestions */}
            {!message && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {suggestions.map((suggestion, idx) => (
                        <button
                            key={idx}
                            onClick={() => setMessage(suggestion)}
                            className="px-3 py-1.5 text-xs font-medium text-[var(--text-tertiary)] bg-[var(--surface)] border border-[var(--border)] rounded-full hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}

            {/* Input Area */}
            <div className="chat-input flex items-end gap-2 p-2">
                <div className="flex-1 flex items-center gap-2">
                    <Sparkles size={18} className="text-[var(--accent)] flex-shrink-0 ml-2" />
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onInput={handleInput}
                        placeholder={placeholder || "Describe your system requirements or request changes..."}
                        disabled={isLoading}
                        rows={1}
                        className="flex-1 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none outline-none text-sm py-2"
                        style={{ maxHeight: '160px' }}
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!message.trim() || isLoading}
                    className={`
            p-2 rounded-[var(--radius-md)] transition-all flex-shrink-0
            ${message.trim() && !isLoading
                            ? 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]'
                            : 'bg-[var(--background-tertiary)] text-[var(--text-muted)] cursor-not-allowed'
                        }
          `}
                >
                    {isLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <Send size={18} />
                    )}
                </button>
            </div>

            <p className="text-xs text-[var(--text-muted)] text-center mt-2">
                Press <kbd className="px-1.5 py-0.5 bg-[var(--surface)] border border-[var(--border)] rounded text-[10px]">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-[var(--surface)] border border-[var(--border)] rounded text-[10px]">Shift+Enter</kbd> for new line
            </p>
        </div>
    );
}
