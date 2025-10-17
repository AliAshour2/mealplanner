import { MCPClientConfig, MCPResponse, ProfileMCP } from "@/types/mcp";

function createMcpClient<T extends MCPClientConfig>(config: T) {
  const client = {
    request: async <R>(endpoint: string, options?: RequestInit): Promise<MCPResponse<R>> => {
      const response = await fetch(`${config.baseURL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'An error occurred');
      }
      return data;
    },
  };

  return {
    profile: {
      get: (userId: string) => 
        client.request<ProfileMCP>(`/api/profile?userId=${userId}`),
      update: (userId: string, data: Partial<ProfileMCP>) =>
        client.request<ProfileMCP>('/api/profile', {
          method: 'PUT',
          body: JSON.stringify({ userId, ...data }),
        }),
    },
  };
}

export const mcpClient = createMcpClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  endpoints: {
    profile: {
      get: (userId: string) => ({
        url: `/api/profile?userId=${userId}`,
        method: "GET",
      }),
      update: (userId: string, data: any) => ({
        url: `/api/profile`,
        method: "PUT",
        body: { userId, ...data },
      })
    },
    mealPlans: {
      create: (data: any) => ({
        url: `/api/meal-plans`,
        method: "POST",
        body: data,
      }),
      get: (id: string) => ({
        url: `/api/meal-plans/${id}`,
        method: "GET",
      })
    }
  }
});
