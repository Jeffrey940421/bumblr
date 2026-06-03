import { useSelector, useDispatch } from "react-redux"
import { useState, useEffect, useRef } from "react"
import { useChat } from "../../context/ChatContext"
import "./Chat.css"
import { addMessageThunk, readMessageThunk } from "../../store/message"

export function Chat() {
  const { showChat, setShowChat, chatId, setChatId } = useChat()
  const user = useSelector(state => state.users.users[chatId])
  const current_user = useSelector(state => state.session.user)
  const messages = useSelector(state => state.messages[chatId])
  const [newMessage, setNewMessage] = useState("")
  const dispatch = useDispatch()
  const [error, setError] = useState([])
  const bottomRef = useRef()

  const handleSubmit = async () => {
    const data = await dispatch(addMessageThunk({
      content: newMessage,
      recipient_id: chatId
    }))
    if (data) {
      setError(data)
    } else {
      setNewMessage("")
    }
  }

  useEffect(() => {
    if (showChat) {
      dispatch(readMessageThunk(chatId))
    }
  }, [messages])

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: "auto"
      })
    }
  }, [messages])

  return (
    <div className={`chat-container ${showChat && current_user ? "" : " hidden"}`}>
      {
        user &&
        <>
          <div className="chat-header">
            <img src={user.profilePic} alt="profile" />
            <span>{user.username}</span>
            <span onClick={() => setShowChat(false)}>X</span>
          </div>
          {
            messages &&
            <div className="chat-body">
              {
                messages.map(message => {
                  return (
                    <div
                      className={`chat-content ${message.sender.id === chatId ? "received" : "sent"}`}
                      key={message.id}
                    >
                      <span>{message.content}</span>
                    </div>
                  )
                })
              }
              <div className="chat-body-bottom" ref={bottomRef}></div>
            </div>
          }
          <textarea
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
          />
          <button
            disabled={!newMessage}
            onClick={handleSubmit}
          >
            Send
          </button>
        </>
      }
    </div>

  )
}
