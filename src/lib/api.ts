const API_BASE_URL =
  process.env.NEXT_PUBLIC_SARJOM_API_URL ||
  "http://localhost:4000";

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`SARJOM API error: ${response.status}`);
  }

  const json: unknown = await response.json();

  if (
    typeof json === "object" &&
    json !== null &&
    "success" in json &&
    json.success === false
  ) {
    const message =
      "error" in json && typeof json.error === "string"
        ? json.error
        : "SARJOM API request failed.";
    throw new Error(message);
  }

  return json as T;
}

/*
 * SARJOM AI / SEARCH
 */
export type SarjomSearchResult = {
  id?: string;
  title?: string;
  name?: string;
  type?: string;
  category?: string;
  organization?: string;
  description?: string;
  snippet?: string;
  url?: string;
  [key: string]: unknown;
};

export async function searchSarjom(query: string) {
  return request<{
    success: boolean;
    query: string;
    results: Array<{
      type: "job" | "record";
      score: number;
      item: SarjomSearchResult;
    }>;
  }>(`/api/search?q=${encodeURIComponent(query)}`);
}

/*
 * ADMIN AI
 *
 * Requests go through the Next.js server-side proxy.
 * The admin token is never exposed to the browser.
 */
export type AdminAiPlan = {
  action: "update-job" | "inspect-job" | "refresh-job" | "unsupported";
  jobId: string | null;
  patch: Record<string, unknown>;
  reason: string;
  requiresConfirmation: boolean;
  issuedAt: string;
  expiresAt: string;
};

export type AdminAiPlanResponse = {
  success: boolean;
  plan?: AdminAiPlan;
  planSignature?: string;
  executed?: boolean;
  message?: string;
  result?: unknown;
  error?: string;
};

export async function createAdminAiPlan(
  command: string,
): Promise<AdminAiPlanResponse> {
  const response = await fetch("/api/admin/ai-command", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      command: command.trim(),
      confirm: false,
    }),
    cache: "no-store",
  });

  const json = (await response.json()) as AdminAiPlanResponse;

  if (!response.ok || json.success === false) {
    throw new Error(json.error || "Admin AI analysis failed.");
  }

  return json;
}

export async function executeAdminAiPlan(
  command: string,
  plan: AdminAiPlan,
  planSignature: string,
): Promise<AdminAiPlanResponse> {
  const response = await fetch("/api/admin/ai-command", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      command: command.trim(),
      confirm: true,
      plan,
      planSignature,
    }),
    cache: "no-store",
  });

  const json = (await response.json()) as AdminAiPlanResponse;

  if (!response.ok || json.success === false) {
    throw new Error(json.error || "Admin AI execution failed.");
  }

  return json;
}

/*
 * CONTENT
 */
export async function getContent(
  type?: string,
  id?: string,
) {
  const search = new URLSearchParams();

  if (type) search.set("type", type);
  if (id) search.set("id", id);

  const query = search.toString();

  return request<{
    success: boolean;
    records: Record<string, unknown>[];
  }>(`/api/content${query ? `?${query}` : ""}`);
}

/*
 * TRENDS
 */
export async function getTrends() {
  return request<{
    success: boolean;
    trends: Record<string, unknown> | unknown[];
  }>("/api/trends");
}

/*
 * GEOGRAPHY
 */
export async function getGeography() {
  return request<{
    success: boolean;
    geography: Record<string, unknown> | unknown[];
  }>("/api/geography");
}
