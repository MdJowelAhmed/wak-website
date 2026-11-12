/** Keep client uploads below the Server Action body limit (multipart overhead). */
export const SERVER_ACTION_BODY_LIMIT = "5mb" as const;

/** Max file size users may attach before invoking a Server Action. */
export const MAX_UPLOAD_FILE_BYTES = 4 * 1024 * 1024;

export const MAX_UPLOAD_FILE_MB = MAX_UPLOAD_FILE_BYTES / (1024 * 1024);

export function isUploadWithinLimit(file: File): boolean {
  return file.size <= MAX_UPLOAD_FILE_BYTES;
}
