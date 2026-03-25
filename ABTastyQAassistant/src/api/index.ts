import { BUCKETING_API_URL } from "../constants";
import { BucketingDTO } from "../types.local";
import { format } from "../utils";
import { HttpError } from "./HttpError";


export async function getBucketingFile(envId: string, signal?: AbortSignal): Promise<BucketingDTO> {
  const requestUrl = format(BUCKETING_API_URL, { envId });
  const res = await fetch(requestUrl, { signal });
  if (res.status >= 400) {
    const body = await res.json();
    throw new HttpError(res.status, body);
  }
  return res.json();
}