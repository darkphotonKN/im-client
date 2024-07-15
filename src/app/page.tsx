"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import NewMessageForm from "@/components/Form/NewMessage";

export default function Home() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [message, setMessages] = useState<string[]>([]);
  const [nameValue, setNameValue] = useState<string>("");

  useEffect(() => {
    // create a new websocket server
    const socket = new WebSocket("ws://localhost:7007/ws");

    socket.onopen = () => {
      console.log("Connected to web socket server!");
      // Send a message to the server
      const message = {
        action: "greet",
        username: "client",
        message: "Hello, server!",
      };

      socket.send(JSON.stringify(message));
    };

    socket.onmessage = (event) => {
      const { data: json } = event;
      const message = JSON.parse(json);
      console.log("Message:", message);
    };

    socket.onclose = () => {
      console.log("Disconnected from Websocket Server.");
    };

    // set websocket to state for persistent usage
    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  // use name value to fire off a websocket message
  function handleJoinChat() {
    if (nameValue) {
      console.log("sending user to websockets");

      const msgPayload = {
        action: "joinchat",
        message: nameValue,
      };

      ws?.send(JSON.stringify(msgPayload));
    }
  }

  function handleInpChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNameValue(event.target.value);
  }

  return (
    <div className={styles.mainView}>
      <h2>Instant Messaging </h2>

      {/* Text Area */}
      <div className={styles.textArea}></div>

      {/* Send Message Form */}

      <div className={styles.joinChat}>
        <label htmlFor="name">Name</label>
        <input
          placeholder="Enter Name"
          name="name"
          value={nameValue}
          onChange={handleInpChange}
        />
        <button onClick={handleJoinChat}>Join Chat</button>
      </div>

      <NewMessageForm socket={ws} />
    </div>
  );
}
