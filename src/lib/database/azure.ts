import axios from 'axios';

export class AzureDatabase {
  private static instance: AzureDatabase;
  private baseUrl: string;
  private headers: Record<string, string>;

  private constructor() {
    this.baseUrl = import.meta.env.VITE_AZURE_API_URL;
    this.headers = {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': import.meta.env.VITE_AZURE_API_KEY
    };
  }

  static getInstance() {
    if (!AzureDatabase.instance) {
      AzureDatabase.instance = new AzureDatabase();
    }
    return AzureDatabase.instance;
  }

  async connect() {
    try {
      const result = await this.query('SELECT 1');
      if (!result) throw new Error('Connection test failed');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect to database';
      throw new Error(message);
    }
  }

  async query(text: string, params?: any[]) {
    if (!this.baseUrl) {
      throw new Error('Database URL not configured');
    }

    try {
      const response = await axios.post(`${this.baseUrl}/query`, {
        query: text,
        params: params || []
      }, {
        headers: this.headers
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      return {
        rows: response.data.rows || [],
        rowCount: response.data.rowCount || 0
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Database query failed: ${error.response?.data?.message || error.message}`);
      }
      throw new Error('Database query failed');
    }
  }
}

export const db = AzureDatabase.getInstance();