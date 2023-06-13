import { useState, createContext, useContext, useEffect } from "react";
import { useAuthUser } from "react-auth-kit";
import * as mqtt from "mqtt/dist/mqtt";

const CommentsContext = createContext();
export const useMqtt = () => useContext(CommentsContext);

export default function MqttProvider({ children }) {
  const auth = useAuthUser();
  const username = auth();
  const [client, setClient] = useState();
  const [subscribedTopics, setSubscribedTopics] = useState([]);

  setTimeout(() => console.log(subscribedTopics), 2000);

  useEffect(() => {
    if (client) client.end();
    const c = mqtt.connect("ws://127.0.0.1", {
      port: 8082,
    });

    setClient(c);
  }, [username]);

  const subscribe = (topic) => {
    if (client && !subscribedTopics.includes(topic)) {
      client.subscribe(topic);
      setSubscribedTopics([...subscribedTopics, topic]);
    }
  };

  const unsubscribe = (topic) => {
    if (client) {
      client.unsubscribe(topic);
      setSubscribedTopics(subscribedTopics.filter((t) => t != topic));
    }
  };

  return (
    <CommentsContext.Provider value={{ client, subscribe, unsubscribe }}>
      {children}
    </CommentsContext.Provider>
  );
}
