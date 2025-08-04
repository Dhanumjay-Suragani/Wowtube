// src/app/components/WebEditor.tsx
"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const AceEditor = dynamic(async () => {
  const ace = await import("react-ace");
  await import("ace-builds/src-noconflict/ext-language_tools");
  await import("ace-builds/src-noconflict/mode-html");
  await import("ace-builds/src-noconflict/mode-css");
  await import("ace-builds/src-noconflict/mode-javascript");
  await import("ace-builds/src-noconflict/theme-monokai");
  return ace.default;
}, { ssr: false });

export default function WebEditor() {
  const [activeTab, setActiveTab] = useState("html");
  const [html, setHtml] = useState("<!DOCTYPE html>\n<html>\n<head></head>\n<body>Your code goes here</body>\n</html>");
  const [css, setCss] = useState("body { font-family: Arial; }");
  const [js, setJs] = useState("console.log('Hello from JS');");
  const [iframeKey, setIframeKey] = useState(0);

  const runCode = () => setIframeKey((prev) => prev + 1);
  const resetCode = () => {
    setHtml("<!DOCTYPE html>\n<html>\n<head></head>\n<body>Your code goes here</body>\n</html>");
    setCss("body { font-family: Arial; }");
    setJs("console.log('Hello from JS');");
    setIframeKey((prev) => prev + 1);
  };

  const getCombinedCode = () => `
    <html>
      <head><style>${css}</style></head>
      <body>
        ${html}
        <script>${js}</script>
      </body>
    </html>
  `;

  return (
    <div className="flex flex-1">
      <div className="w-1/2 flex flex-col bg-gray-800">
        <div className="flex items-center bg-black p-2">
          <button onClick={() => setActiveTab("html")} className={`px-4 py-2 ${activeTab === "html" ? "bg-gray-700" : ""}`}>HTML</button>
          <button onClick={() => setActiveTab("css")} className={`px-4 py-2 ${activeTab === "css" ? "bg-gray-700" : ""}`}>CSS</button>
          <button onClick={() => setActiveTab("js")} className={`px-4 py-2 ${activeTab === "js" ? "bg-gray-700" : ""}`}>JS</button>

          <button className="ml-auto mr-2 bg-blue-600 px-3 py-1 rounded" onClick={resetCode}>Reset Code</button>
          <button className="bg-green-600 px-3 py-1 rounded" onClick={runCode}>Run Code</button>
        </div>

        {AceEditor && (
          <AceEditor
            mode={activeTab}
            theme="monokai"
            value={activeTab === "html" ? html : activeTab === "css" ? css : js}
            onChange={(value) => {
              if (activeTab === "html") setHtml(value);
              else if (activeTab === "css") setCss(value);
              else setJs(value);
            }}
            fontSize={14}
            showGutter
            highlightActiveLine
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </div>

      <div className="w-1/2 bg-white">
        <iframe
          key={iframeKey}
          srcDoc={getCombinedCode()}
          className="w-full h-full"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}
