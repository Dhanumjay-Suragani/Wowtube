// src/app/components/EditorPanel.tsx
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const WebEditor = dynamic(() => import("./WebEditor"));
const PythonEditor = dynamic(() => import("./PythonEditor"));
const CEditor = dynamic(() => import("./CEditor"));

export default function EditorPanel() {
  const [languageGroup, setLanguageGroup] = useState("Web");

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="flex items-center bg-black p-2">
        <div className="ml-auto">
          <select
            className="bg-gray-700 px-2 py-1 rounded"
            value={languageGroup}
            onChange={(e) => setLanguageGroup(e.target.value)}
          >
            <option value="Web">Web</option>
            <option value="Python">Python</option>
            <option value="C">C</option>
          </select>
        </div>
      </div>

      {languageGroup === "Web" && <WebEditor />}
      {languageGroup === "Python" && <PythonEditor />}
      {languageGroup === "C" && <CEditor />}
    </div>
  );
}
