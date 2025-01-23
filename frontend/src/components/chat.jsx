import { useState, useEffect, useRef } from "react";
import { messageToAPI } from "../services/messageToAPI";

export const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const createTextGlobe = ({ message, sender }) => {
        const newMessage = {
            text: message,
            sender,
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    const sendHandler = () => {
        if (message.trim()) {
            createTextGlobe({message, sender: 'user'});
            //send message to API...
            messageToAPI(message).then((data) => {
                createTextGlobe({message: data.response, sender: 'bot'});
            });
            console.log('Message sent:', message);
            setMessage('');
        } else {
            console.log('Message is empty');
        }
    };

    const messagesToShow = () => {
        return(
            messages.map((msg, index) => (
                <li
                    key={index}
                    className={msg.sender === 'user' ? 'userMessage' : 'botMessage'}
                >
                    {msg.sender === 'user' ? 'User Message' : 'Bot Message'}
                    <p>{msg.text}</p>
                </li>
            ))
        )
    };
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); 
            sendHandler();
        }
    };

    return(
        <div>
            <h2 style={{textAlign:'center'}}>Sushi Delivery</h2>
            <div className='chat'>
                <ul className='messages'>
                    {messagesToShow()}
                    <div ref={messagesEndRef} />
                </ul>
            </div>
            <div className='send'> 
                <input
                    placeholder='type message...'
                    type="textarea"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e)}
                />
                <button onClick={sendHandler}> enviar </button>
            </div>
        </div>
    )
}