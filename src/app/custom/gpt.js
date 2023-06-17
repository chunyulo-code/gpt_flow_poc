"use client";

import { useState, useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import useNode from "./hooks/useNode";
import useEdge from "./hooks/useEdge";
import fakeData from "../utils/chatGptFormat";
export default function Gpt() {
  const [inputMsg, setInputMsg] = useState("");
  const [msgHistory, setMsgHistory] = useState([]);
  const [resNodes, setResNodes] = useState([]);
  const [resEdges, setResEdges] = useState([]);
  const { nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange } =
    useContext(ChatContext);

  const system1 = `You are a highly professional AI assistant, and you must adhere to the following two rules when answering questions from now on: (1) You can only respond using Markdown language, and (2) You can only respond using mind map format or structure. (3) You can only use "#" and "-" markdown syntax`;
  const system2 = `You are a highly professional AI assistant, and you must adhere to the following rules when answering questions from now on: (1) You can only respond with hierarchical json format, for example: 
[
  {
    "level": "1",
    "title": "FrondEnd Roadmap",
    "content": "This is a road map for frontend engineer",
    "children": [
      {
        "level": 2,
        "title": "Javascript",
        "content": "Javascript is a single-thread language...",
        "children": [
          {
            "level": 3,
            "title": "React",
            "content": "React is a javascript framework..."
          },
          {
            "level": 3,
            "title": "Vue",
            "content": "Vue is a javascript framework..."
          }
        ]
      },
      {
        "level": 2,
        "title": "HTML",
        "content": "........",
        "children": []
      },
      {
        "level": 2,
        "title": "CSS",
        "content": "........",
        "children": [
          {
            "level": 3,
            "title": "Tailwind",
            "content": "Tailwind is a utility-first css library"
          },
          {
            "level": 3,
            "title": "Bootstrap",
            "content": "Bootstrap is a UI library"
          }
        ]
      }
    ]
  }
]

 (2) I use these data for making a mind map, so please answer with mind map and json structute
 (3)Cannot answer over 200 tokens or 150 words
 (4) It has to be a json format, cannot be cut out`;
  let currentId = nodes.length;
  function genNodesNEdges(res, parentId = null) {
    res.forEach((item, index) => {
      currentId++;
      const newNode = useNode(currentId, item.title, parentId, {
        x: 200,
        y: 200 * (index - Math.floor(res.length / 2))
      });
      setResNodes((prev) => [...prev, newNode]);
      if (parentId) {
        const newEdge = useEdge(parentId, currentId);
        setResEdges((prev) => [...prev, newEdge]);
      }

      if (item.children && item.children.length > 0) {
        genNodesNEdges(item.children, currentId);
      }
    });
  }

  function genFakeNodesNEdges(e) {
    e.preventDefault();
    genNodesNEdges(fakeData, "3");
    setNodes((nds) => nds.concat(resNodes));
    setEdges((eds) => eds.concat(resEdges));
    console.log(resNodes);
    console.log(resEdges);
  }

  async function callGPT(e, question) {
    e.preventDefault();
    const requestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: system2
        },
        {
          role: "user",
          content: `${question}`
        }
      ],
      max_tokens: 200
    };
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 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`
      },
      body: JSON.stringify(requestBody)
    };
    setMsgHistory((prevMsgHistory) => [
      ...prevMsgHistory,
      {
        role: "user",
        content: `${question}`
      }
    ]);
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      requestOptions
    );
    const completion = await response.json();
    const responseMessage = completion.choices[0].message;
    console.log(responseMessage);
    setMsgHistory((prevMsgHistory) => [...prevMsgHistory, responseMessage]);
    const { newNodes, newEdges } = genNodesNEdges(responseMessage.content);
    setNodes((nds) => nds.concat(newNodes));
    setEdges((eds) => eds.concat(newEdges));
  }

  return (
    <div className=" flex flex-col items-center mt-5 p-5 absolute z-50">
      <form action="" className="mb-6">
        <h2 className="text-white">Chat GPT</h2>
        <input
          type="text"
          className="text-black"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
        />
        <button
          onClick={(e) => {
            console.log(inputMsg);
            callGPT(e, inputMsg);
          }}
          className="border-2 border-violet-500 border-solid px-2 py-2 rounded-md ml-5 text-white"
        >
          Send Message
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            const newNode = {
              id: nodes.length + 1,
              data: "clock to add",
              parentNode: "2",
              position: {
                x: 200,
                y: 0
              },
              style: { visibility: "visible" }
            };
            setNodes((nds) => nds.concat(newNode));
          }}
          className="border-2 border-violet-500 border-solid px-2 py-2 rounded-md ml-5 text-white"
        >
          Add random node
        </button>
        <button
          onClick={(e) => {
            genFakeNodesNEdges(e);
          }}
          className="border-2 border-violet-500 border-solid px-2 py-2 rounded-md ml-5 text-white"
        >
          Gen Fake
        </button>
      </form>
      <div>
        {msgHistory.map((message, index) => (
          <div
            key={index}
            className={`px-3 py-3 mb-3 rounded-lg ${
              message.role === "user" ? "bg-red-400" : "bg-blue-400"
            }`}
          >
            <span className="font-bold">{message.role}: </span>
            <span>{message.content}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
