"use client";
import { ChatContextProvider, ChatContext } from "../context/ChatContext";
import { ReactFlowProvider } from "reactflow";

import GPT from "./gpt";
import Flow from "./components/Flow";

export default () => {
  return (
    <ReactFlowProvider>
      <ChatContextProvider>
        <GPT />
        <Flow />
      </ChatContextProvider>
    </ReactFlowProvider>
  );
};
