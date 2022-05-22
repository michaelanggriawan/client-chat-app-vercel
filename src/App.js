import "./App.css";
import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import Chat from "./Chat";

const socket = io.connect("https://still-headland-15979.herokuapp.com/");

function App() {
  const [username, setUsername] = useState();
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [usersOnline, setUsersOnline] = useState([]);
  const [socketId, setSocketId] = useState("");

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("online", { room, username, socketId });
      const isUserOnline = usersOnline.find(
        (user) => user.room === room && user.username === username
      );
      if (isUserOnline) {
        alert(
          `${username} is used inside ${room}, please choose another name!`
        );
      } else {
        socket.emit("join_room", { room, username, socketId });
        setShowChat(true);
      }
    }
  };

  useEffect(() => {
    socket.on("user_online", ({ username, room, socketId }) => {
      setUsersOnline([...usersOnline, { username, room, socketId }]);
    });
  }, [socketId, usersOnline]);

  useEffect(() => {
    socket.on("user_offline", (socketId) => {
      const removeUserOnline = usersOnline.filter(
        (user) => user.socketId !== socketId
      );
      setUsersOnline(removeUserOnline);
    });
  }, [usersOnline]);

  useEffect(() => {
    socket.on("clientConnected", (socketId) => {
      setSocketId(socketId);
    });
  }, []);

  return (
    <div className="App">
      {showChat ? (
        <Chat socket={socket} username={username} room={room} />
      ) : (
        <div className="joinChatContainer">
          <div>
            <h3>Join Chatroom</h3>
            <input
              type="text"
              placeholder="Username"
              onChange={(event) => setUsername(event.target.value)}
            />
            <input
              type="text"
              placeholder="Room ID"
              onChange={(event) => setRoom(event.target.value)}
            />
          </div>
          <div display="flex">
            <button onClick={joinRoom}>Join</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
