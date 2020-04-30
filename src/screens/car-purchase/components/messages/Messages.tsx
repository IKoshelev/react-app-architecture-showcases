import React from 'react';
import { useMessages } from './useMessages';
// do we even need this typing? 
export const Messages: React.FC = () => {
    const hook = useMessages();

    if (!hook.showMessages) {
        return null;
    }

    return (
        <div className='car-purchase-messages'>
            {hook?.messages?.map(message => (
                <div key={message}>{message}</div>
            ))}
        </div>
    )
}