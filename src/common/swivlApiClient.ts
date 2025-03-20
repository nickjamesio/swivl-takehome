import { Result, ResultType } from './result.js';

export type Variable = {
  id: number;
  orgId: number;
  locationId: number | null;
  key: string;
  value: string;
};

export type Location = {
  id: number;
  orgId: number;
};

const API_BASE_URL = 'https://swivl-interview-e61c73ef3cf5.herokuapp.com';

export class SwivlApiClient {
  private async get<T>(
    path: string,
    { maxRetries = 3 } = {},
  ): Promise<ResultType<T>> {
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        const url = new URL(path, API_BASE_URL);
        const response = await fetch(url);

        if (!response.ok) {
          return Result.fail(
            new Error(`HTTP error! status: ${response.status}`),
          );
        }

        const data = await response.json();
        return Result.ok(data as T);
      } catch {
        retryCount++;

        // Calculate delay with exponential backoff and jitter
        const baseDelay = Math.pow(2, retryCount) * 1000; // 2^n seconds
        const jitter = Math.floor(Math.random() * 200); // Random delay between 0-200ms
        const delay = baseDelay + jitter;

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    return Result.fail(new Error('Failed to fetch data'));
  }

  public getVariables() {
    return this.get<Array<Variable>>('/api/variables');
  }

  public getLocations() {
    return this.get<Array<Location>>('/api/locations');
  }
}
