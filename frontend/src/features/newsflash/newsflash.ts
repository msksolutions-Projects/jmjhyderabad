export interface FlashIssue {
  title: string;
  /** A promised issue whose file has not yet been delivered. */
  status?: "pending";
  /** A locally hosted PDF in frontend/public. */
  file?: string;
  cover?: string;
  date?: string;
  bytes?: number;
}

/** Local PDF routes only; no external Drive links. */
export function issueLinks(issue: FlashIssue) {
  return { view: issue.file ?? "", download: issue.file ?? "", cover: issue.cover };
}

export type Kind = "jubilee" | "newsflash";

/** Issues listed in public/data/newsflash.json (no rebuild needed to add one). */
export async function fetchIssues(kind: Kind, signal?: AbortSignal): Promise<FlashIssue[]> {
  const response = await fetch("/data/newsflash.json", { signal });
  if (!response.ok) throw new Error("The list of issues could not be loaded.");
  const data = (await response.json()) as Partial<Record<Kind, FlashIssue[]>>;
  return Array.isArray(data[kind]) ? data[kind]! : [];
}

