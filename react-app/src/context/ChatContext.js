import { createContext, useState, useContext } from "react";

const ChatContext = createContext();

export function ChatProvider(props) {
  const [showChat, setShowChat] = useState(false)
  const [chatId, setChatId] = useState("")
  const [socket, setSocket] = useState(null)

  return (
    <ChatContext.Provider value={{showChat, setShowChat, chatId, setChatId, socket, setSocket}}>
      {props.children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  return useContext(ChatContext)
}
