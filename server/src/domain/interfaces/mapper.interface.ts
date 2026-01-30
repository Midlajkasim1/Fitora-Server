
export interface IMapper<E, M> {

  toEntity(doc: M): E;

  toMongo(entity: E, passwordHash?: string, options?: object): Partial<M>;
}