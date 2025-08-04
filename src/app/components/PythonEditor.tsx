// src/app/components/PythonEditor.tsx
"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const AceEditor = dynamic(async () => {
  const ace = await import("react-ace");
  await import("ace-builds/src-noconflict/mode-python");
  await import("ace-builds/src-noconflict/theme-monokai");
  return ace.default;
}, { ssr: false });

export default function PythonEditor() {
  const [code, setCode] = useState("print('Hello from Python')");
  const [output, setOutput] = useState("");

  const runPython = () => {
    // Browser can't run Python directly
    setOutput("Python execution not implemented (needs backend).");
  };

  return (
    <div className="flex flex-1">
      <div className="w-1/2 flex flex-col bg-gray-800">
        <div className="flex items-center bg-black p-2">
          <button className="ml-auto mr-2 bg-green-600 px-3 py-1 rounded" onClick={runPython}>Run Code</button>
        </div>

        {AceEditor && (
          <AceEditor
            mode="python"
            theme="monokai"
            value={code}
            onChange={setCode}
            fontSize={14}
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </div>

      <div className="w-1/2 bg-black text-white p-4">
        <h3 className="text-lg font-bold mb-2">Output:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
}
