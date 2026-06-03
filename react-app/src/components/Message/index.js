import { useSelector, useDispatch } from "react-redux"
import { useState, useEffect } from "react"
import "./Message.css"
import { useChat } from "../../context/ChatContext"
import { readMessageThunk } from "../../store/message"

export function Message() {
  const current_user = useSelector(state => state.session.user)
  const allMessages = useSelector(state => state.messages)
  const allUsers = useSelector(state => state.users.users)
  const [status, setStatus] = useState("read")
  const [keyword, setKeyword] = useState("")
  const follows = useSelector(state => state.users.singleUser.userFollowing)
  const { showChat, setShowChat, chatId, setChatId } = useChat()
  const dispatch = useDispatch()

  return (
    <div className="message-container">
      <div className="message-header">
        <span>{current_user.username}</span>
        <button
          onClick={() => setStatus(status === "read" ? "send" : "read")}
        >{status === "read" ? "New Message" : "Nevermind"}</button>
      </div>
      <div className="message-body">
        {
          status === "read" &&
          Object.values(allMessages).map(messages => {
            return (
              <div
                className="message-content"
                key={messages[0].associated_user.id}
                onClick={() => {
                  setChatId(messages[0].associated_user.id)
                  setShowChat(true)
                  dispatch(readMessageThunk(messages[0].associated_user.id))
                }}
              >
                <img src={messages[0].associated_user.profilePic} alt="profile" />
                <span>{messages[0].associated_user.username}</span>
                <span>{messages[messages.length - 1].content}</span>
                <div>
                  {
                    messages[0].associated_user.id === chatId && showChat ?
                      0 :
                      messages.filter(message => message.read === false && message.recipient.id === current_user.id).length
                  }
                </div>
              </div>
            )
          })
        }
        {
          status === "send" &&
          <>
            <span>To:</span>
            <input
              type="text"
              placeholder="Search"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
            {
              keyword ?
                Object.values(allUsers).filter(user => user.username.includes(keyword) && user.id !== current_user.id).length > 0 ?
                  Object.values(allUsers).filter(user => user.username.includes(keyword) && user.id !== current_user.id).map(user => {
                    return (
                      <div
                        className="message-send-to"
                        key={user.id}
                        onClick={() => {
                          setChatId(user.id)
                          setShowChat(true)
                          dispatch(readMessageThunk(user.id))
                        }}
                      >
                        <img src={user.profilePic} alt="profile" />
                        <span>{user.username}</span>
                        <span>{user.bio ? user.bio : ""}</span>
                      </div>
                    )
                  }) :
                  <span>Never heard of'em</span> :
                <>
                  <span>Followed Users</span>
                  {follows.map(user => {
                    return (
                      <div
                        className="message-send-to"
                        key={user.id}
                        onClick={() => {
                          setChatId(user.id)
                          setShowChat(true)
                          dispatch(readMessageThunk(user.id))
                        }}
                      >
                        <img src={user.profilePic} alt="profile" />
                        <span>{user.username}</span>
                        <span>{user.bio ? user.bio : ""}</span>
                      </div>
                    )
                  })}
                </>
            }
          </>
        }
      </div>
    </div>
  )
}
