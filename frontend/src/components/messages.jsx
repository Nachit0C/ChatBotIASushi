import { useEndOfChat } from '../hooks/useEndOfChat';
import { useChatStore } from '../store/chatStore';

function messagestoShow(messages) {
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
}

export function Messages(){
    const messages = useChatStore((state) => state.messages);
    const messagesEndRef = useEndOfChat(messages);

    return(
        <ul className='messages'>
            {messagestoShow(messages)}
            <div ref={messagesEndRef} />
        </ul>
    )
};