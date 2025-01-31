import { useState, useCallback } from 'react';
import { messageToAPI } from "../services/messageToAPI";
import { useChatStore } from '../store/chatStore';

export function ChatForm (){
    const [message, setMessage] = useState('');
    const updateMessages = useChatStore((state) => state.updateMessages);

    const sendMessage = useCallback((msg) => {
        console.log('MessageFromSendMessage:', msg);
        if (msg.trim()) {
            updateMessages({message: msg, sender: 'user'});
            //send message to API...

            messageToAPI(msg)
            .then((res) => {
                updateMessages({message: res, sender: 'bot'});
            })
            .catch((error) => {
                console.log('Error:', error);
                updateMessages({message:'Nuestro chatbot no está funcionando en este momento, intentalo mas tarde', sender: 'bot'});
            });

            // Esta línea no sé para qué sirve, chequear.
            setMessage('');
        } else {
            console.log('Message is empty');
            setMessage('');
        }
    }, [updateMessages]);

    const handleChange = (event) => {
        const newMessage = event.target.value
        setMessage(newMessage);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        sendMessage(message);
    }
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); 
            sendMessage(message);
        }
    };

    return(
        <form className='send' onSubmit={handleSubmit}>
            <input
                placeholder='type message...'
                type="textarea"
                value={message}
                name="messageFromChaT"
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e)}
            />
            <button type='submit'> enviar </button>
        </form>
    )
}