import { useEffect, useRef } from 'react';

export const useEndOfChat = (messages) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return messagesEndRef;
}