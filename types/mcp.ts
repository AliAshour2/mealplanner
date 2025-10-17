// MCP Types for Profile
export interface ProfileMCP {
  id: string;
  userId: string;
  email: string;
  subscriptionTier: string | null;
  subscriptionActive: boolean;
  stripeSubscriptionId: string | null;
  nextBillingDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// MCP Response Types
export interface MCPResponse<T> {
  data: T;
  error?: string;
}

// MCP Client Types
export interface MCPClientConfig {
  baseURL: string;
  endpoints: {
    [key: string]: {
      [method: string]: (...args: any[]) => {
        url: string;
        method: string;
        body?: any;
      };
    };
  };
}

// MCP Operation Context
export interface MCPContext {
  params: {
    [key: string]: any;
  };
  headers?: Record<string, string>;
}
