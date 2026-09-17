import { MAX_FILE_SIZE, uploadFile } from "@/lib/gemini/upload";
import { handleApiError } from "@/lib/utils/errors";

export async function POST(req: Request) {
  try {
    const contentLength = req.headers.get("content-length");
    const maxRequestSize = 4.5 * 1024 * 1024;

    if (contentLength && Number(contentLength) > maxRequestSize) {
      return Response.json(
        {
          error: `File exceeds max size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
          code: "FILE_TOO_LARGE",
        },
        { status: 413 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    const result = await uploadFile(file);

    return Response.json(result); // { fileId, state }
  } catch (err) {
    return handleApiError(err);
  }
}
