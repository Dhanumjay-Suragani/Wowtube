import { NextResponse } from "next/server";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = body.code;

    // Use system temp folder
    const tempDir = os.tmpdir();  // e.g., C:\Users\YourUser\AppData\Local\Temp
    const filePath = path.join(tempDir, "program.c");
    const outPath = path.join(tempDir, "program.exe"); // Windows needs .exe

    fs.writeFileSync(filePath, code);

    return new Promise((resolve) => {
      const compile = spawn("gcc", [filePath, "-o", outPath]);

      let compileError = "";

      compile.stderr.on("data", (data) => {
        compileError += data.toString();
      });

      compile.on("close", (code) => {
        if (compileError) {
          resolve(NextResponse.json({ output: compileError }));
        } else {
          const run = spawn(outPath);
          let runOutput = "";

          run.stdout.on("data", (data) => {
            runOutput += data.toString();
          });

          run.stderr.on("data", (data) => {
            runOutput += data.toString();
          });

          run.on("close", () => {
            resolve(NextResponse.json({ output: runOutput }));
          });
        }
      });
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}
