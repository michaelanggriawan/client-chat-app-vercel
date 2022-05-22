import { useEffect, useState } from "react";
import SendIcon from "./icons/SendIcon";

export default function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  const receiveMessage = (data) => {
    setMessageList((list) => [...list, data]);
  };

  useEffect(() => {
    socket.on("receive_message", receiveMessage);

    return () => socket.off("receive_message", receiveMessage);
  }, [socket]);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(
        `https://still-headland-15979.herokuapp.com/messages/${room}`
      );
      const result = await response.json();
      setMessageList([...result.messages, ...messageList]);
    };

    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>{room}</h1>
      </div>
      <div className="chat-body">
        {messageList.map((messageContent) => {
          if (messageContent.author === username) {
            return (
              <div className="left-position">
                <div className="message-meta">
                  <p id="time">{messageContent.time}</p>
                  <p id="author">{messageContent.author}</p>
                </div>
                <div className="you">
                  <p>{messageContent.message}</p>
                </div>
              </div>
            );
          }
          return (
            <div className="right-position">
              <div className="message-meta">
                <p id="time">{messageContent.time}</p>
                <p id="author">{messageContent.author}</p>
              </div>
              <div className="other">
                <p>{messageContent.message}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Send a message..."
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && sendMessage()}
          value={currentMessage}
        />
        <div className="send-icon" onClick={sendMessage}>
          <SendIcon />
        </div>
      </div>
    </div>
  );
}
