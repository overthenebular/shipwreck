import { NextResponse } from "next/server";
import { buildRadioLogPrompt } from "@/lib/radioLogPrompt";
import {
  createFallbackContent,
  parseGeneratedRadioLogContent,
  type GeneratedRadioLogContent,
  type RadioLog,
} from "@/lib/radioLog";
import { selectSeaState } from "@/lib/selectSeaState";

export const runtime = "nodejs";

const LOCATION_HINT = "제주 북부 해역";
const SEOUL_TIME_ZONE = "Asia/Seoul";

type OpenAIResponse = {
  output?: Array<{
    content?: Array<{ type?: string; text?: string }>;
  }>;
  error?: { message?: string; code?: string; type?: string };
};

function getOutputText(response: OpenAIResponse): string | null {
  for (const item of response.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.type === "output_text" && content.text) return content.text;
    }
  }
  return null;
}

function getTimestamps(now: Date) {
  const date = new Intl.DateTimeFormat("sv-SE", {
    timeZone: SEOUL_TIME_ZONE,
  }).format(now);
  const datetime = `${new Intl.DateTimeFormat("sv-SE", {
    timeZone: SEOUL_TIME_ZONE,
    dateStyle: "short",
    timeStyle: "short",
    hour12: false,
  }).format(now)} KST`;
  return { date, datetime };
}

export async function POST(request: Request) {
  let userInput = "";
  try {
    const payload = (await request.json()) as { userInput?: unknown };
    userInput = typeof payload.userInput === "string" ? payload.userInput.trim() : "";
  } catch {
    return NextResponse.json({ error: "잘못된 신호 형식입니다." }, { status: 400 });
  }

  if (!userInput) return NextResponse.json({ error: "신호가 비어 있습니다." }, { status: 400 });
  if (userInput.length > 280) {
    return NextResponse.json({ error: "신호는 280자 이하여야 합니다." }, { status: 400 });
  }

  const now = new Date();
  const { date, datetime } = getTimestamps(now);
  const selectedSeaState = selectSeaState(userInput);
  let generated: GeneratedRadioLogContent | null = null;
  let generationMode: RadioLog["generationMode"] = "ai";
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (apiKey) {
    try {
      const openAIResponse = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL?.trim() || "gpt-5.4-mini",
          instructions: buildRadioLogPrompt({
            userInput,
            currentDatetime: datetime,
            locationHint: LOCATION_HINT,
            selectedSeaState,
          }),
          input: "지정된 JSON 스키마에 맞춰 통신 로그를 생성한다.",
          max_output_tokens: 700,
          reasoning: { effort: "low" },
          text: {
            format: {
              type: "json_schema",
              name: "radio_log",
              strict: true,
              schema: {
                type: "object",
                additionalProperties: false,
                properties: {
                  seaCode: { type: "string", enum: [selectedSeaState.code] },
                  openingLine: { type: "string", minLength: 1 },
                  body: {
                    type: "array",
                    items: { type: "string", minLength: 1 },
                    minItems: 3,
                    maxItems: 5,
                  },
                  closingLine: { type: "string", minLength: 1 },
                },
                required: ["seaCode", "openingLine", "body", "closingLine"],
              },
            },
          },
        }),
      });

      const response = (await openAIResponse.json()) as OpenAIResponse;
      if (openAIResponse.ok) {
        const outputText = getOutputText(response);
        if (outputText) generated = parseGeneratedRadioLogContent(outputText, selectedSeaState);
      } else {
        console.error("OpenAI API error:", openAIResponse.status, response.error?.message);
      }
    } catch (error) {
      console.error("Radio log AI generation failed:", error);
    }
  } else {
    console.error("OPENAI_API_KEY is not configured; using the safe local fallback.");
  }

  if (!generated) {
    generated = createFallbackContent(userInput, selectedSeaState);
    generationMode = "fallback";
  }

  const log: RadioLog = {
    number: String(Math.floor(Math.random() * 900) + 100),
    date,
    datetime,
    coordinate: null,
    locationHint: LOCATION_HINT,
    code: selectedSeaState.code,
    summary: selectedSeaState.internalCondition,
    openingLine: generated.openingLine,
    body: generated.body,
    closingLine: generated.closingLine,
    generationMode,
  };

  return NextResponse.json({ log });
}
