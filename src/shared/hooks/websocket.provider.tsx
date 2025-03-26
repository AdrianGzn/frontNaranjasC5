import React, { createContext, useState, useEffect, useContext } from "react";

type WebSocketConnections = {
  [key: string]: WebSocket | null;
};

interface WebSocketProps {
  connections: WebSocketConnections;
  closeConnection: (key: string) => void;
  addConnection: (key: string, url: string) => void;
}

const WebSocketContext = createContext<WebSocketProps | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [connections, setConnections] = useState<WebSocketConnections>({});

  const addConnection = (key: string, url: string) => {
    if (connections[key]) return;

    const socket = new WebSocket(url);

    socket.onopen = () => console.log(`WebSocket [${key}] conectado`);
    socket.onerror = (err) => console.error(`Error en WebSocket [${key}]:`, err);
    socket.onmessage = (message) => console.log(`Mensaje de [${key}]:`, message.data);

    setConnections((prev) => ({ ...prev, [key]: socket }));
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
    <WebSocketContext.Provider value={{ connections, addConnection, closeConnection }}>
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
