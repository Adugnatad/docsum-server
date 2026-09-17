import { ai } from "./client";
import { ApiError } from "@/lib/utils/errors";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/markdown",
  "application/json",
  "text/plain",
  "image/jpeg",
  "image/png",
];

export interface UploadResult {
  fileId: string;
  state: string;
}

export async function uploadFile(file: File | null): Promise<UploadResult> {
  if (!file) {
    throw new ApiError("No file provided", 400, "MISSING_FILE");
  }

  // if (file.size > MAX_FILE_SIZE) {
  //   throw new ApiError(
  //     `File exceeds max size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
  //     413,
  //     "FILE_TOO_LARGE",
  //   );
  // }

  const mimeType = file.type || "application/octet-stream";
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new ApiError(
      `Unsupported file type: ${mimeType}`,
      415,
      "UNSUPPORTED_TYPE",
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const fileBlob = new Blob([arrayBuffer], { type: mimeType });

  try {
    const uploaded = await ai.files.upload({
      file: fileBlob,
      config: { displayName: file.name },
    });

    return {
      fileId: uploaded.name || "", // Gemini's file resource name, e.g. "files/abc123"
      state: uploaded.state || "",
    };
  } catch (err) {
    throw new ApiError("Failed to upload file to Gemini", 502, "UPLOAD_FAILED");
  }
}
