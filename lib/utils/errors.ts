export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function handleApiError(err: unknown): Response {
  console.error("[API Error]", err);

  if (err instanceof ApiError) {
    return Response.json(
      { error: err.message, code: err.code },
      { status: err.statusCode },
    );
  }

  return Response.json({ error: "Internal server error" }, { status: 500 });
}
