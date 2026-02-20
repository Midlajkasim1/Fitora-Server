export interface IOtpStore {
  save(key: string, value: unknown, ttlSeconds: number): Promise<void>;
  get<T>(key: string): Promise<T | null>;
  delete(key: string): Promise<void>;
}

