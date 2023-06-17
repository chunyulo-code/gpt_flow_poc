import React from "react";
import { useNodesState, useEdgesState } from "reactflow";
import { initNodes } from "@/app/data/nodes";
import { initEdges } from "@/app/data/edges";
const ChatContext = React.createContext();

function ChatContextProvider(props) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);

  return (
    <ChatContext.Provider
      value={{ nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange }}
    >
      {props.children}
    </ChatContext.Provider>
  );
}

export { ChatContextProvider, ChatContext };
