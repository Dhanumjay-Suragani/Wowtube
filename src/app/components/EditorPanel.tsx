// src/app/components/EditorPanel.tsx
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
}, {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

export default function EditorPanel() {
  const [activeTab, setActiveTab] = useState<"html" | "css" | "js">("html");
  const [html, setHtml] = useState("<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n  Your code goes here\n</body>\n</html>");
  const [css, setCss] = useState("body { font-family: Arial; }");
  const [js, setJs] = useState("console.log('Hello from JS');");
  const [previewMode, setPreviewMode] = useState("Web");
  const [iframeKey, setIframeKey] = useState(0);

  const runCode = () => {
    setIframeKey(prev => prev + 1); // reload iframe
  };

  const resetCode = () => {
    setHtml("<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n  Your code goes here\n</body>\n</html>");
    setCss("body { font-family: Arial; }");
    setJs("console.log('Hello from JS');");
    setIframeKey(prev => prev + 1);
  };

  const getCombinedCode = () => {
    return `
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>
    `;
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Left Panel - Code Editor */}
      <div className="w-1/2 flex flex-col bg-gray-800">
        {/* Tabs & Toolbar */}
        <div className="flex items-center bg-black p-2">
          <button onClick={() => setActiveTab("html")} className={`px-4 py-2 ${activeTab === "html" ? "bg-gray-700" : ""}`}>HTML</button>
          <button onClick={() => setActiveTab("css")} className={`px-4 py-2 ${activeTab === "css" ? "bg-gray-700" : ""}`}>CSS</button>
          <button onClick={() => setActiveTab("js")} className={`px-4 py-2 ${activeTab === "js" ? "bg-gray-700" : ""}`}>JAVASCRIPT</button>

          <button className="ml-auto mr-2 bg-blue-600 px-3 py-1 rounded" onClick={resetCode}>Reset Code</button>
          <button className="bg-green-600 px-3 py-1 rounded" onClick={runCode}>Run Code</button>

          <select
            className="ml-2 bg-gray-700 px-2 py-1 rounded"
            value={previewMode}
            onChange={(e) => setPreviewMode(e.target.value)}
          >
            <option value="Web">Web</option>
            <option value="Mobile">Mobile</option>
          </select>
        </div>

        {/* Code Editor */}
        {AceEditor && (
          <AceEditor
            mode={activeTab === "html" ? "html" : activeTab === "css" ? "css" : "javascript"}
            theme="monokai"
            value={activeTab === "html" ? html : activeTab === "css" ? css : js}
            onChange={(value) => {
              if (activeTab === "html") setHtml(value);
              else if (activeTab === "css") setCss(value);
              else setJs(value);
            }}
            fontSize={14}
            showPrintMargin
            showGutter
            highlightActiveLine
            enableBasicAutocompletion
            enableLiveAutocompletion
            enableSnippets
            setOptions={{
              tabSize: 2,
              showLineNumbers: true,
            }}
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </div>

      {/* Right Panel - Live Preview */}
      <div className="w-1/2 bg-white">
        <iframe
          key={iframeKey}
          srcDoc={getCombinedCode()}
          title="Live Preview"
          className="w-full h-full"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}
