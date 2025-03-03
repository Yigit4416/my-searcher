import { NextResponse } from "next/server";
import { run } from "~/server/gemini";

interface RequestBody {
  prompt: string;
}

export async function POST(request: Request) {
  try {
    const data: RequestBody = await request.json();

    if (!data.prompt) {
      return NextResponse.json({ error: "Prompt is missing" }, { status: 400 });
    }

    const response = await run(data.prompt);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}
