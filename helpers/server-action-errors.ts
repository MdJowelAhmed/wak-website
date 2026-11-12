export function isServerActionBodyLimitError(error: unknown): boolean {
  const text = extractErrorText(error);
  return /body exceeded/i.test(text) || /bodysizelimit/i.test(text);
}

function extractErrorText(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message: unknown }).message;
    return typeof message === "string" ? message : "";
  }
  return "";
}
