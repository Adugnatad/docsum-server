import { getFileStatus } from "@/lib/gemini/status";
import { handleApiError } from "@/lib/utils/errors";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ fileId: string }> },
) {
  try {
    const { fileId: rawFileId } = await params;
    const fileId = decodeURIComponent(rawFileId);
    const status = await getFileStatus(fileId);

    return Response.json(status);
  } catch (err) {
    return handleApiError(err);
  }
}
