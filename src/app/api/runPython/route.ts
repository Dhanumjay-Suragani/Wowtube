import { NextResponse } from "next/server";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = body.code;

    const filePath = path.join("E:/tmp", "script.py"); // ✅ use a valid Windows path
    fs.writeFileSync(filePath, code);

    return new Promise((resolve) => {
      const pythonProcess = spawn("python", [filePath]); // ✅ renamed from process → pythonProcess
      let output = "";
      let error = "";

      pythonProcess.stdout.on("data", (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        error += data.toString();
      });

      pythonProcess.on("close", () => {
        resolve(
          NextResponse.json({
            output: error ? error : output,
          })
        );
      });
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}
