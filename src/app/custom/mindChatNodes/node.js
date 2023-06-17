"use client";
import React, { memo } from "react";
import { Handle, Position } from "reactflow";

function CustomNode({ data }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md border-2 border-[#66fcf1]">
      {/* <div className="flex">
        <div className="rounded-full w-12 h-12 flex justify-center items-center bg-gray-100">
          {data.emoji}
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold text-[#ffffff]">{data.name}</div>
          <div className="text-[#c5c6c7]">{data.job}</div>
        </div>
      </div> */}
      <div className="text-lg font-bold text-[#ffffff]">{data}</div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 rounded-full border-2 border-white !bg-[#66fcf1]"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 rounded-full border-2 border-white !bg-[#66fcf1]"
      />
    </div>
  );
}

export default memo(CustomNode);
