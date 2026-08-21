import { uploadFile } from "@/lib/gemini/upload";
import { handleApiError } from "@/lib/utils/errors";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    const result = await uploadFile(file);

    return Response.json(result); // { fileId, state }
  } catch (err) {
    return handleApiError(err);
  }
}
