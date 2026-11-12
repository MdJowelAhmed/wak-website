"use client";

import { myFetch, type FetchResponse } from "../../helpers/myFetch";
import { isServerActionBodyLimitError } from "../../helpers/server-action-errors";

/** Returned as `message` when Next.js rejects the Server Action request body. */
export const MY_FETCH_UPLOAD_TOO_LARGE = "MY_FETCH_UPLOAD_TOO_LARGE";

export async function invokeMyFetch<T = unknown>(
  ...args: Parameters<typeof myFetch>
): Promise<FetchResponse<T>> {
  try {
    return await myFetch<T>(...args);
  } catch (error) {
    if (isServerActionBodyLimitError(error)) {
      return {
        success: false,
        message: MY_FETCH_UPLOAD_TOO_LARGE,
        data: null as T,
        error: "Body exceeded Server Action size limit",
      };
    }

    return {
      success: false,
      message: "Request failed",
      data: null as T,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
