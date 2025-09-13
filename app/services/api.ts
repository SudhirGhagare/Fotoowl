import axios, { AxiosRequestConfig } from "axios";

const DEFAULT_TIMEOUT = 10000;
const MAX_RETRIES = 3;
const BACKOFF_BASE = 500;

export type ImageItem = {
  id: number;
  event_id: number;
  name: string;
  mime_type: string;
  width: number;
  height: number;
  low_path: string;
  raw_path: string;
  med_path: string;
  raw_id: string;
  low_id: string;
  med_id: string;
  source: number;
  collaborator_id: string;
  click_time: string;
  update_time: string;
  size: number;
  create_time: string;
  path_dict_array: any | null;
  is_hidden: boolean;
  upload_by: number;
  compression_factor: number;
  note: string | null;
  index_status: number;
  collaborator_name: string | null;
  img_url: string;
  thumbnail_url: string;
  med_url: string;
  high_url: string;
  path_dict: {
    img_url: string;
    thumbnail_url: string;
    med_url: string;
    high_url: string;
  };
};

export type ImageListResponse = {
  ok: boolean;
  data : {
  image_list: ImageItem[];
  page: number;
  page_size: number;
  total?: number;
}
};

async function timeoutPromise<T>(
  p: Promise<T>,
  ms: number,
  controller: AbortController
) {
  return new Promise<T>((resolve, reject) => {
    const id = setTimeout(() => {
      controller.abort();
      reject(new Error("timeout"));
    }, ms);
    p.then((v) => {
      clearTimeout(id);
      resolve(v);
    }).catch((e) => {
      clearTimeout(id);
      reject(e);
    });
  });
}

export async function fetchWithRetry<T>(
  url: string,
  config?: AxiosRequestConfig,
  retries = MAX_RETRIES,
  timeout = DEFAULT_TIMEOUT,
  signal?: AbortSignal
): Promise<T> {
  let attempt = 0;
  let lastErr: any = null;

  while (attempt <= retries) {
    const controller = new AbortController();
  //  console.log(`Fetch attempt ${attempt+1} for ${url}`);
    if (signal) {
      if (signal.aborted) controller.abort();
      signal.addEventListener("abort", () => controller.abort());
    }

    try {

      const promise = axios.request<T>({
        url,
        method: "GET",
        ...config,
        signal: controller.signal as any,
      });

      const res = await timeoutPromise<T>(
        promise.then((r) => r.data),
        timeout,
        controller
      );


    
      return res;
    } catch (err) {

      lastErr = err;
      attempt += 1;

      if (attempt > retries) break;

      const backoff = BACKOFF_BASE * Math.pow(2, attempt - 1) + Math.floor(Math.random() * 200);

      await new Promise((r) => setTimeout(r, backoff));
    }
  }

  throw lastErr || new Error("fetch failed");
}

export function buildImageListUrl(params: {
  event_id: string | number;
  page: number;
  page_size: number;
  key: string;
  order_by?: number;
  order_asc?: boolean;
}) {
  const {
    event_id,
    page,
    page_size,
    key,
    order_by = 2,
    order_asc = true,
  } = params;
  
  const base = process.env.EXPO_BASE_URL 
 
  const qs = new URLSearchParams({
    event_id: String(event_id),
    page: String(page),
    page_size: String(page_size),
    key,
    order_by: String(order_by),
    order_asc: String(order_asc),
  });
  return `${base}?${qs.toString()}`;
}

export default {
  fetchWithRetry,
  buildImageListUrl,
};
