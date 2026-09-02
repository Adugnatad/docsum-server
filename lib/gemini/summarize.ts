import { summaryJsonSchema } from "../utils/types";
import { ai } from "./client";
import { ApiError } from "@/lib/utils/errors";

const DEFAULT_PROMPT = "Summarize this document in clear, concise language.";

export async function runSummaryInteraction(
  fileId: string,
  customPrompt?: string,
): Promise<string> {
  const file = await ai.files.get({ name: fileId });

  if (file.state === "PROCESSING") {
    throw new ApiError("File is still processing", 409, "STILL_PROCESSING");
  }
  if (file.state === "FAILED") {
    throw new ApiError(
      "Gemini file processing failed",
      502,
      "PROCESSING_FAILED",
    );
  }

  try {
    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: [
        { type: "document", uri: file.uri, mime_type: file.mimeType },
        { type: "text", text: customPrompt || DEFAULT_PROMPT },
      ],
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: summaryJsonSchema,
      },
    });

    if (!interaction.output_text) {
      throw new ApiError(
        "Gemini returned an empty response",
        502,
        "EMPTY_RESPONSE",
      );
    }

    return interaction.output_text;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError("Failed to generate summary", 502, "SUMMARY_FAILED");
  }
}
