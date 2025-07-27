"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const ReactAce = dynamic(
  async () => {
    const ace = await import("react-ace");
    return ace.default;
  },
  { ssr: false }
);

export default function AceEditor() {
  const [code, setCode] = useState<string>("// Start coding...");

  // ✅ Load ace-builds only in browser after component mounts
  useEffect(() => {
    import("ace-builds/src-noconflict/mode-javascript");
    import("ace-builds/src-noconflict/theme-monokai");
  }, []);

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <ReactAce
        mode="javascript"
        theme="monokai"
        name="ace-editor"
        value={code}
        onChange={(val: string) => setCode(val)}
        fontSize={16}
        width="100%"
        height="400px"
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
        }}
      />
    </div>
  );
}
