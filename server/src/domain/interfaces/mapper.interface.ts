export interface IMapper<E, M> {
  toEntity(doc: M): E;
  toMongo(entity: E, ...args: any[]): Partial<M>;
}