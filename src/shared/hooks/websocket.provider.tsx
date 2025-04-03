import React, { createContext, useState, useEffect, useContext } from "react";

type WebSocketConnections = {
  [key: string]: WebSocket | null;
};

type WebsocketMessages = {
  [key: string]: any[]
}

interface WebSocketProps {
  connections: WebSocketConnections;
  messages: WebsocketMessages; 
  closeConnection: (key: string) => void;
  addConnection: (url: string) => WebSocket;
}

const WebSocketContext = createContext<WebSocketProps | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [connections, setConnections] = useState<WebSocketConnections>({});
  const [messages, setMessages ] = useState<WebsocketMessages>({})

  const addConnection = (url: string): WebSocket => {
    const socket = new WebSocket(url);
    return socket
  };

  const closeConnection = (key: string) => {
    const connection = connections[key];

    if (connection) {
      connection.close();
      setConnections((prev) => {
        const newConnections = { ...prev };
        delete newConnections[key];
        return newConnections;
      });
    }
  };

  useEffect(() => {
    return () => {
      Object.values(connections).forEach((ws) => ws?.close());
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ messages, connections, addConnection, closeConnection }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("Error: WebSocketContext no está dentro de WebSocketProvider");
  }
  return context;
};
