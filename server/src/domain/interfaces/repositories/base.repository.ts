export interface IBaseRepository<T> {
  create(item: T): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  find(filter: Record<string, unknown>, options: { skip: number; limit: number }): Promise<T[]>;
  findOne(filter: Record<string, unknown>): Promise<T | null>;
  update(id: string, update: Record<string, unknown>): Promise<T | null>;
  delete(id: string): Promise<T | null>;
  count(filter: Record<string, unknown>): Promise<number>;
}