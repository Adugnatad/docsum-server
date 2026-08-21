import { runSummaryInteraction } from "@/lib/gemini/summarize";
import { handleApiError } from "@/lib/utils/errors";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ fileId: string }> },
) {
  try {
    const { fileId } = await params;
    const decodedFileId = decodeURIComponent(fileId);
    const body = await req.json().catch(() => ({}));
    const customPrompt = body?.prompt as string | undefined;

    const summary = await runSummaryInteraction(decodedFileId, customPrompt);

    return Response.json({ summary });
  } catch (err) {
    return handleApiError(err);
  }
}
