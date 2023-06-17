"use client";
import React, { useCallback, useEffect, useRef, useContext } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  useReactFlow,
  useKeyPress
} from "reactflow";
import { ChatContext } from "@/app/context/ChatContext";
import "reactflow/dist/base.css";
import CustomNode from "@/app/custom/mindChatNodes/node";
import CustomInputNode from "@/app/custom/mindChatNodes/inputNode";

const nodeTypes = {
  custom: CustomNode,
  customInput: CustomInputNode
};

export default function Flow() {
  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);
  const { nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange } =
    useContext(ChatContext);
  const { project } = useReactFlow();
  const enterPressed = useKeyPress("Enter");
  const tabPressed = useKeyPress("Tab");

  let id = nodes.length;
  const getId = () => `${id++}`;

  //Drag-Drop-Add-Nodes----------------------------------------------------
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );
  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd = useCallback(
    (event) => {
      const targetIsPane = event.target.classList.contains("react-flow__pane");
      console.log(targetIsPane);
      if (targetIsPane) {
        console.log(event.clientX, event.clientY);
        // we need to remove the wrapper bounds, in order to get the correct position
        console.log(reactFlowWrapper.current.getBoundingClientRect());
        const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
        const id = getId();
        const newNode = {
          id: getId(),
          // we are removing the half of the node width (75) to center the new node
          position: project({
            x: event.clientX - left - 75,
            y: event.clientY - top - 35
          }),
          type: "custom",
          data: "new node",
          height: 70,
          width: 150
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({ id, source: connectingNodeId.current, target: id })
        );
      }
    },
    [project]
  );
  //Drag-Drop-Add-Nodes----------------------------------------------------

  useEffect(() => {
    console.log("Enter pressed", enterPressed);
  }, [enterPressed]);

  useEffect(() => {
    console.log("Tab pressed", tabPressed);
  }, [tabPressed]);

  useEffect(() => {
    console.log(nodes);
  }, [nodes]);

  useEffect(() => {
    console.log(edges);
  }, [edges]);

  return (
    <div className="h-screen w-screen wrapper" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        nodeTypes={nodeTypes}
        fitView
        className="bg-[#1f2833]"
      >
        <MiniMap />
        <Controls />
        <button
          onClick={(e) => {
            e.preventDefault();
            const newNode = {
              id: nodes.length + 1,
              data: "click to add",
              parentNode: "2",
              position: {
                x: 200,
                y: 0
              },
              style: { visibility: "visible" }
            };
            setNodes((nds) => nds.concat(newNode));
          }}
          className="border-2 border-violet-500 border-solid px-2 py-2 rounded-md ml-5 text-white fixed bottom-0 z-10"
        >
          Add random node
        </button>
      </ReactFlow>
    </div>
  );
}
