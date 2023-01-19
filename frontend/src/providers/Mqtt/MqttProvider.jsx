import { useState, createContext, useContext, useEffect } from "react";

import { useSearchParams } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";
import * as mqtt from "mqtt/dist/mqtt";
import axios from "axios";

const MqttContext = createContext();
export const useMqtt = () => useContext(MqttContext);

export default function MqttContextProvider({ children }) {
  const auth = useAuthUser();
  const username = auth();
  const [client, setClient] = useState();

  useEffect(() => {
    const c = mqtt.connect("ws://127.0.0.1", {
      port: 8081,
    });

    c.subscribe("test")
    c.on("message", (topic, msg) => console.log("MQTT MESSAGE:", msg.toString()))

    // console.log("Connected to broker as", username || "(NO USER)", "connection:", c);
    setClient(c);
  }, [username]);

  const test = () => client.publish("test", `${username} sends a ping`)

  const comments = {
    connect: (callback) => {
      client.subscribe("comments");
      client.on("message", (topic, message) => {
        if (topic == "comments") callback(message);
      });
    },
    publish: (payload) => username && client.publish("comments", payload),
  };

  const game = {
    connect: (callback) => {
      client.subscribe("game");
      client.on("message", (topic, message) => {
        if (topic == "game") callback(message);
      });
    },
    publish: (payload) => username && client.publish("comments", payload),
  };

  return (
    <MqttContext.Provider value={{ client, comments, game, test }}>
      {children}
    </MqttContext.Provider>
  );
}
