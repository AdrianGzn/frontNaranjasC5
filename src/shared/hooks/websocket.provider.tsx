import React, { createContext, useState, useEffect } from 'react';
import WebSocketModel from '../models/websocket-model';

const WebSocketContext = createContext<WebSocketModel | null>(null);

export const WebSocketProvider = ({children}: any) => {
  const [ws, setWs] = useState<any>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8081");
    setWs(socket);

    socket.onopen = () => {
      console.log("Conección al websocket exitosa");
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Mensaje recibido:\n", message);
    };

    socket.onerror = (error) => {
      console.error("Error al conectar el:\n", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ws}}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => React.useContext(WebSocketContext);
