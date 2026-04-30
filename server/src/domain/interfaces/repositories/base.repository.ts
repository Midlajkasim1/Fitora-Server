import { ClientSession } from "mongoose";

export interface IBaseRepository<T> {
  create(item: T, session?: ClientSession): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  find(filter: Record<string, unknown>, options: { skip: number; limit: number }): Promise<T[]>;
  findOne(filter: Record<string, unknown>): Promise<T | null>;
  update(id: string, update: Record<string, unknown>, session?: ClientSession): Promise<T | null>;
  delete(id: string): Promise<T | null>;
  count(filter: Record<string, unknown>): Promise<number>;
}