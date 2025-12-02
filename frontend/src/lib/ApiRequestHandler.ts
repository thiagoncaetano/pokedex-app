import { authUtils } from "@/features/auth/lib/auth";
import { useRouter } from "next/router";
import { routes } from "@/routes";

const API_URL = process.env.API_URL;

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions {
  path: string;
  method?: Method;
  body?: unknown;
  headers?: Record<string, string>;
}

export async function ApiRequestHandler<T = unknown>({
  path,
  method = "GET",
  body,
  headers = {},
}: RequestOptions): Promise<T> {
  if (!API_URL) {
    throw new ApiError("API_URL is not configured", 500);
  }

  const token = authUtils.getAuthToken();

  const options: RequestInit = {
    method,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
      ...headers,
    },
  };

  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${API_URL}/${path}`, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    if (response.status === 401) {
      authUtils.removeTokens();
      if (typeof window !== 'undefined') {
        const router = useRouter();
        router.push(routes.login);
      }
    }
    
    throw new ApiError(errorData.message || "API request failed", response.status);
  }

  return await response.json();
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "Error";
    this.status = status;
  }
}
