export interface AnalysisRequest {
  repoId?: string;
  prUrl?: string;
  analysisType?: string;
  fileContent?: string;
  filePath?: string;
}

export interface AnalysisResponse {
  id: string;
  quality_score: number;
  security_score: number;
  performance_score: number;
  architecture_score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  refactoring?: string[];
  security_issues?: Array<{ file: string; severity: string; issue: string; line?: number }>;
  performance_issues?: Array<{ file: string; impact: string; issue: string }>;
  architecture_findings?: Array<{ category: string; status: string; notes: string[] }>;
  comments?: Array<{ file: string; line?: number; type: string; comment: string }>;
  overall_assessment?: string;
  created_at: string;
}

export interface AgentRequest {
  repoId: string;
  prNumber: number;
}

export interface AgentResponse {
  fix_id: string;
  fixes_found: number;
  fixes_applied: number;
  summary: string;
}

export interface Repository {
  id: string;
  repo_name: string;
  description: string | null;
  language: string | null;
  repo_url: string;
}

export class APIClient {
  baseUrl: string = "https://code-companion-ai.hareeshreddy916.workers.dev";
  private token: string = "";

  setToken(token: string): void {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };
    if (this.token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || `API error: ${response.status}`);
    }

    return response.json();
  }

  async analyzeFile(filePath: string, content: string): Promise<AnalysisResponse> {
    return this.request<AnalysisResponse>("/functions/v1/analyze-file", {
      method: "POST",
      body: JSON.stringify({ filePath, content }),
    });
  }

  async analyzeWorkspace(repoId: string, analysisType: string = "full_review"): Promise<AnalysisResponse> {
    return this.request<AnalysisResponse>("/functions/v1/analyze-repo", {
      method: "POST",
      body: JSON.stringify({ repoId, analysisType }),
    });
  }

  async reviewPR(prUrl: string): Promise<AnalysisResponse> {
    return this.request<AnalysisResponse>("/functions/v1/analyze-pr", {
      method: "POST",
      body: JSON.stringify({ prUrl }),
    });
  }

  async dispatchAgent(request: AgentRequest): Promise<AgentResponse> {
    return this.request<AgentResponse>("/functions/v1/autonomous-fix", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async getRepositories(): Promise<Repository[]> {
    return this.request<Repository[]>("/functions/v1/repositories");
  }

  async getAnalyses(limit: number = 20): Promise<AnalysisResponse[]> {
    return this.request<AnalysisResponse[]>(`/functions/v1/analyses?limit=${limit}`);
  }

  async getPRReviews(limit: number = 20): Promise<AnalysisResponse[]> {
    return this.request<AnalysisResponse[]>(`/functions/v1/pr-analyses?limit=${limit}`);
  }
}