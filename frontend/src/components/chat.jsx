import { Messages } from "./messages.jsx";
import { ChatForm } from "./chatForm.jsx";
import { useChatStore } from "../store/chatStore.js";

export const Chat = () => {
    const reset = useChatStore((state) => state.reset);
    return(
        <div>
            <h2 style={{textAlign:'center'}}>Sushi Delivery</h2>
            <div className='chat'>
                <Messages />
            </div>
            <ChatForm />

            <button onClick={reset}>Reset Chat</button>
        </div>
    )
}