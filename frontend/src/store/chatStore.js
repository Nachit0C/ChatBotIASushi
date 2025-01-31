import { create } from 'zustand'
import { persist } from 'zustand/middleware';

export const useChatStore = create( persist( (set, get) => {

    return{
        messages: [],

        updateMessages: ({ message, sender }) => {
            const messages  = get().messages;
            
            const newMessages = [
                ...messages,
                {
                    text: message,
                    sender
                }
            ];
            set({messages: newMessages});
        },

        reset: () => {
            set({messages: []});
        }
    }
}), {
    name: 'chat-storage'
});