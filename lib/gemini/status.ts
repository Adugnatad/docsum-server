import { ai } from "./client";
import { ApiError } from "@/lib/utils/errors";

export interface FileStatus {
  fileId: string;
  state: string;
  uri?: string;
  mimeType?: string;
}

export async function getFileStatus(fileId: string): Promise<FileStatus> {
  try {
    const file = await ai.files.get({ name: fileId });

    return {
      fileId: file.name || "",
      state: file.state || "",
      uri: file.uri,
      mimeType: file.mimeType,
    };
  } catch (err) {
    throw new ApiError("File not found or expired", 404, "FILE_NOT_FOUND");
  }
}
