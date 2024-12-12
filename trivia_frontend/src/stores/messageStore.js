import { create } from "zustand";
import { persist } from "zustand/middleware";

const useMessageStore = create(
    persist (
        (set)=>({
            storedMessages: [],

            setMessages: (messages)=>{
                console.log("Updating store with messages:", messages);
                set ({ storedMessages: messages });
            },

            addMessages: (messages)=>{
                set((state)=>{
                    console.log("Adding messages to store:", messages);
                    return { storedMessages: [...state.storedMessages, ...messages] };
                })
            },

            removeMessage: (messageId)=>{
                set((state)=>({
                    storedMessages: state.storedMessages.filter((message)=> message.id !== messageId),
                }));
            },
        }),
        {
            name: "message-store",  
        }
    )
)

export default useMessageStore;